const Cart = require("../model/cartmodel");

// Create or update cart for a user
const createOrUpdateCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        // Find the cart for the user
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if the product already exists in the cart
            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
            
            if (productIndex !== -1) {
                // Update quantity if product already exists
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add new product to the cart
                cart.products.push({ productId, quantity });
            }

            // Save updated cart
            await cart.save();
            return res.status(200).json({ message: "Cart updated successfully", cart });
        } else {
            // Create a new cart if it doesn't exist
            cart = new Cart({ userId, products: [{ productId, quantity }] });
            await cart.save();
            return res.status(201).json({ message: "Cart created successfully", cart });
        }
    } catch (error) {
        console.error("Error creating/updating cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get the cart for a user
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId", "name price stock");
        
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Remove a product from the cart
const removeProductFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Remove product from cart
        cart.products = cart.products.filter(p => p.productId.toString() !== productId);

        // Save updated cart
        await cart.save();
        return res.status(200).json({ message: "Product removed from cart", cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Clear the entire cart
const clearCart = async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        // Clear all products in the cart
        cart.products = [];

        // Save updated cart
        await cart.save();
        return res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createOrUpdateCart,
    getCartByUserId,
    removeProductFromCart,
    clearCart
};
