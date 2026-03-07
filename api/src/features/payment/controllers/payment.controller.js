import Stripe from "stripe";
import mongoose from "mongoose";
import { User } from "../../user/models/user.model.js";
import { Product } from "../../product/models/product.model.js";
import { Order } from "../../order/models/order.model.js";
import { Cart } from "../../cart/models/cart.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SHIPPING_COST = 10.0;
const TAX_RATE = 0.08;

export async function createPaymentIntent(req, res) {
  try {
    const { shippingAddress } = req.body;
    const user = req.user;

    if (!shippingAddress) {
      return res.status(400).json({ error: "Shipping address is required" });
    }

    // Get cart from DB
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate stock + calculate total server-side
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;

      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || "",
      });
    }

    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax;

    // Find or create Stripe customer
    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        subtotal: subtotal.toFixed(2),
        shippingCost: SHIPPING_COST.toFixed(2),
        taxAmount: tax.toFixed(2),
        totalAmount: total.toFixed(2),
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderSummary: {
        items: validatedItems,
        subtotal,
        shippingCost: SHIPPING_COST,
        taxAmount: tax,
        totalAmount: total,
      },
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      // Prevent duplicate orders
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      });
      if (existingOrder) {
        return res.json({ received: true });
      }

      const {
        userId,
        orderItems,
        shippingAddress,
        subtotal,
        shippingCost,
        taxAmount,
        totalAmount,
      } = paymentIntent.metadata;

      const items = JSON.parse(orderItems);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Validate stock
        for (const item of items) {
          const product = await Product.findById(item.product).session(session);
          if (!product) throw new Error(`Product not found: ${item.name}`);
          if (product.stock < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Create order
        const order = await Order.create(
          [
            {
              user: userId,
              items,
              shippingAddress: JSON.parse(shippingAddress),
              paymentMethod: "stripe",
              paymentResult: {
                id: paymentIntent.id,
                status: "succeeded",
              },
              subtotal: parseFloat(subtotal),
              shippingCost: parseFloat(shippingCost),
              taxAmount: parseFloat(taxAmount),
              totalAmount: parseFloat(totalAmount),
              paidAt: Date.now(),
            },
          ],
          { session }
        );

        // Update stock
        for (const item of items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { session }
          );
        }

        // Clear cart
        await Cart.findOneAndUpdate(
          { user: userId },
          { items: [], totalPrice: 0 },
          { session }
        );

        await session.commitTransaction();
        console.log("Order created successfully:", order[0]._id);
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
    }
  }

  res.json({ received: true });
}
