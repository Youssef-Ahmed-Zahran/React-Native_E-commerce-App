import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./features/product/models/product.model.js";
import { Category } from "./features/category/models/category.model.js";

// Load environment variables from .env
dotenv.config({ path: "../.env" });
// if seed runs from api/src/seed.js, the relative path to .env in api/ is ../.env, but dotenv default looks in current working dir. We'll use absolute logic or just call config() which defaults to current working directory (usually api/)
dotenv.config();

const productsList = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and travelers.",
    price: 149.99,
    stock: 50,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 128,
  },
  {
    name: "Smart Watch Series 5",
    description:
      "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist.",
    price: 299.99,
    stock: 35,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 256,
  },
  {
    name: "Leather Crossbody Bag",
    description:
      "Handcrafted genuine leather bag with adjustable strap. Features multiple compartments and elegant design perfect for daily use.",
    price: 89.99,
    stock: 25,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    ],
    averageRating: 4.3,
    totalReviews: 89,
  },
  {
    name: "Running Shoes - Pro Edition",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for performance and comfort during long runs.",
    price: 129.99,
    stock: 60,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 342,
  },
  {
    name: "Bestselling Mystery Novel",
    description:
      "A gripping psychological thriller that will keep you on the edge of your seat. New York Times bestseller with over 1 million copies sold.",
    price: 24.99,
    stock: 100,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 1243,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and durable design. Perfect for outdoor adventures.",
    price: 79.99,
    stock: 45,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 167,
  },
  {
    name: "Classic Denim Jacket",
    description:
      "Timeless denim jacket with vintage wash and comfortable fit. A wardrobe essential that pairs perfectly with any outfit.",
    price: 69.99,
    stock: 40,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500",
    ],
    averageRating: 4.2,
    totalReviews: 95,
  },
  {
    name: "Yoga Mat Pro",
    description:
      "Extra-thick non-slip yoga mat with carrying strap. Eco-friendly material provides excellent cushioning and grip for all yoga styles.",
    price: 49.99,
    stock: 75,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 203,
  },
  {
    name: "Mechanical Keyboard RGB",
    description:
      "Gaming keyboard with customizable RGB lighting, mechanical switches, and programmable keys. Built for gamers and typing enthusiasts.",
    price: 119.99,
    stock: 30,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 421,
  },
  {
    name: "Coffee Table Book Collection",
    description:
      "Stunning photography book featuring architecture and design from around the world. Hardcover edition with 300+ pages of inspiration.",
    price: 39.99,
    stock: 55,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 134,
  },
  {
    name: "Minimalist Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. Features a built-in wireless charging pad for your devices.",
    price: 45.99,
    stock: 80,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 215,
  },
  {
    name: "Men's Classic Chronograph Watch",
    description: "Elegant timepiece featuring a genuine leather strap, water resistance up to 50m, and precise quartz movement.",
    price: 185.00,
    stock: 20,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 120,
  },
  {
    name: "Acoustic Guitar Starter Kit",
    description: "Full-size acoustic guitar perfect for beginners. Includes gig bag, tuner, picks, and an extra set of strings.",
    price: 149.50,
    stock: 15,
    category: "Music",
    images: [
      "https://images.unsplash.com/photo-1550227298-1f24f24eb017?w=500",
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 87,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.",
    price: 24.99,
    stock: 150,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
      "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 540,
  },
  {
    name: "Gourmet Whole Bean Coffee",
    description: "1lb bag of single-origin dark roast coffee beans. Rich chocolate and caramel notes. Ethically sourced and freshly roasted.",
    price: 19.99,
    stock: 100,
    category: "Food",
    images: [
      "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500",
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500",
    ],
    averageRating: 4.9,
    totalReviews: 310,
  },
  {
    name: "Wireless Gaming Mouse",
    description: "Ultra-lightweight wireless gaming mouse with 20K DPI optical sensor, RGB lighting, and 70-hour battery life.",
    price: 59.99,
    stock: 65,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479fa?w=500",
      "https://images.unsplash.com/photo-1615663245857-ac1e653815f7?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 442,
  },
  {
    name: "Non-Stick Cookware Set",
    description: "10-piece premium non-stick pots and pans set. Scratch-resistant, dishwasher safe, and suitable for all stovetops.",
    price: 129.00,
    stock: 25,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 189,
  },
  {
    name: "Resistance Bands Set",
    description: "Set of 5 premium stretch resistance bands with varied weight levels. Includes physical therapy guide and carrying bag.",
    price: 18.99,
    stock: 200,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 673,
  },
  {
    name: "Sci-Fi Paperback Novel",
    description: "Award-winning science fiction epic exploring deep space, humanity's future, and interstellar conflict.",
    price: 15.99,
    stock: 85,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=500",
      "https://images.unsplash.com/photo-1589998059171-9899ea8532add?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 250,
  },
  {
    name: "Polarized Retro Sunglasses",
    description: "Classic vintage style polarized sunglasses offering 100% UV protection and glare reduction. Includes hard case.",
    price: 35.00,
    stock: 40,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500",
    ],
    averageRating: 4.2,
    totalReviews: 312,
  },
  {
    name: "Premium Yoga Block",
    description: "High-density EVA foam yoga block. Provides stability and balance for optimal alignment and deeper poses.",
    price: 12.99,
    stock: 120,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1629853926661-0ae15a31a4df?w=500",
      "https://images.unsplash.com/photo-1599839619722-39751411ea63?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 311,
  },
  {
    name: "Noise-Isolating Earbuds",
    description: "Wired in-ear headphones with deep bass and clear sound. Includes a built-in microphone and tangle-free cord.",
    price: 20.00,
    stock: 90,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500",
      "https://images.unsplash.com/photo-1606220838315-056192d5e926?w=500",
    ],
    averageRating: 4.3,
    totalReviews: 890,
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted artisan ceramic mug, 12oz capacity. Microwave and dishwasher safe, featuring a beautiful reactive glaze finish.",
    price: 16.50,
    stock: 45,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500",
      "https://images.unsplash.com/photo-1601614298132-1596e1b682ce?w=500",
    ],
    averageRating: 4.9,
    totalReviews: 405,
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Incredibly soft, 100% organic cotton crewneck t-shirt. Breathable fabric designed for sustainable everyday wear.",
    price: 22.00,
    stock: 300,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 156,
  },
  {
    name: "Standing Desk Converter",
    description: "Adjustable height sit-to-stand desk riser. Spacious dual-tier design fits dual monitors and a keyboard easily.",
    price: 149.99,
    stock: 25,
    category: "Office",
    images: [
      "https://images.unsplash.com/photo-1593642702821-c823b13eb295?w=500",
      "https://images.unsplash.com/photo-1595126738011-fac7397b20f1?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 920,
  },
  {
    name: "Smart LED Light Bulb",
    description: "Wi-Fi enabled multi-color LED smart bulb. Works with voice assistants and requires no hub for simple setup.",
    price: 14.99,
    stock: 400,
    category: "Home",
    images: [
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=500",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 1250,
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables!");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing products and categories
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing categories");

    // Extract unique category names
    const categoryNames = [...new Set(productsList.map((p) => p.category))];
    
    // Insert categories and store their created mappings (Name -> ObjectId)
    const categoryDocs = await Category.insertMany(
      categoryNames.map((name) => ({ name }))
    );
    console.log(`✅ Successfully seeded ${categoryDocs.length} categories`);

    // Create a dictionary for quick lookup: { "Electronics": "64abcdef...", ... }
    const categoryMap = {};
    categoryDocs.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    // Replace string category in product with ObjectId category
    const productsToInsert = productsList.map((p) => ({
      ...p,
      category: categoryMap[p.category],
    }));

    // Insert seed products
    await Product.insertMany(productsToInsert);
    console.log(`✅ Successfully seeded ${productsToInsert.length} products`);

    // Display summary
    console.log("\n📊 Seeded Database Summary:");
    console.log(`Total Products: ${productsToInsert.length}`);
    console.log(`Categories: ${categoryNames.join(", ")}`);

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database seeding completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
