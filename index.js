const express = require("express");
const app = express();
const cors = require("cors")
app.use(express.json());

const corsOption = {
  origin: "*",
  credentials: true
};

app.use(cors(corsOption))
const { initializeDatabase } = require("./db/db.connect");
const Product = require("./model/products.model");

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello");
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
      res
        .status(201)
        .json({ message: "Product added successfully.", product: product });
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
      console.log(products);
      res.status(200).json({ message: "All Products:", products: products });
    } else {
      res.status(404).json({ message: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
