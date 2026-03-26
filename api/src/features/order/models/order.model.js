import mongoose from "mongoose";
import { nanoid } from "nanoid";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date },
    shippedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual("isPaid").get(function () {
  return !!this.paidAt;
});

orderSchema.virtual("isDelivered").get(function () {
  return !!this.deliveredAt;
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });

orderSchema.pre("validate", async function () {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${nanoid(10).toUpperCase()}`;
  }
});

export const Order = mongoose.model("Order", orderSchema);
