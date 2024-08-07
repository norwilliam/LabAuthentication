const Product = require('../models/product');

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// GET product by ID
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new product
exports.createProduct = async (req, res) => {
  try {
    const { product_name, product_type, price, unit } = req.body;
    const newProduct = new Product({
      product_name,
      product_type,
      price,
      unit,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// PUT update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, product_type, price, unit } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { product_name, product_type, price, unit },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// DELETE product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
};