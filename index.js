const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(express.json());

// CORS configuration
const corsOption = {
  origin: "*", // Allow all origins
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOption));

const { initializeDatabase } = require("./db/db.connect");
const Product = require("./model/products.model");

// Initialize the database
initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello");
});

// Debugging CORS route
app.get("/check-cors", (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send("CORS is working");
});

const createProduct = async (newProduct) => {
  try {
    const product = new Product(newProduct);
    const saveProduct = await product.save();
    return saveProduct;
  } catch (error) {
    throw error;
  }
};

app.post("/products", async (req, res) => {
  try {
    const product = await createProduct(req.body);
    if (product) {
      res.status(201).json({ message: "Product added successfully.", product: product });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add product" });
  }
});

async function getAllProducts() {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw error;
  }
}

app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    if (products.length != 0) {
      // console.log(products);
      res.status(200).json({ message: "All Products:", products: products });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});


//get products by id route
async function getProductById(productId) {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw error
  }
}

app.get("/products/:productId", async (req, res) => {
  try {
    const product = await getProductById(req.params.productId);
    if (product) {
      res.json(product)
    } else {
      res.status(404).josn({ error: "Product not found." })
    }
  } catch (error) {
    console.log(error)
    res.status(500).josn({ error: "Failed to fetch Products." })
  }
})


//get products by category route

/* async function productCategories() {
  try {
    const categories = await Product.find({})
  } catch (error) {
    throw error
  }
}
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});

