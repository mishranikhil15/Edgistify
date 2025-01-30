const productmodel = require("../model/productmodel");

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        // Validate input fields
        if (!name || !price || !stock) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newProduct = new productmodel({ name, price, stock });
        await newProduct.save();

        return res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productmodel.find().lean(); // `lean()` improves read performance
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await productmodel.findById(req.params.id).lean();

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    try {
        const { name, price, stock } = req.body;

        const updatedProduct = await productmodel.findByIdAndUpdate(
            req.params.id,
            { name, price, stock },
            { new: true, runValidators: true, lean: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productmodel.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
