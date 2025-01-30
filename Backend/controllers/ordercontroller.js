const Order = require("../model/ordermodel");
const Cart = require("../model/cartmodel");
const Product = require("../model/productmodel");

// Create a new order
const createOrder = async (req, res) => {
    const { shippingAddress, paymentStatus } = req.body;
    const { userId } = req.user; 
    console.log("oooooooooooooooooooo",req.user)
    try {
        // Fetch the user's cart to get the products
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: "Cart is empty, cannot create order" });
        }

        // Validate product stock before creating the order
        let totalPrice = 0;
        const orderProducts = [];

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name}` });
            }

            totalPrice += product.price * item.quantity;
            orderProducts.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // Create the order
        const order = new Order({
            userId,
            products: orderProducts,
            totalPrice,
            shippingAddress,
            paymentStatus,
            orderStatus: 'Pending',
        });

        // Save the order
        await order.save();

        // Clear the cart after order creation
        cart.products = [];
        await cart.save();

        return res.status(201).json({ message: "Order created successfully", order });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get all orders for a user
const getOrdersByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId }).populate("products.productId");

        if (orders.length === 0) {
            return res.status(404).json({ error: "No orders found" });
        }

        return res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findById(id).populate("products.productId");

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update order status (e.g., Pending -> Processing)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    try {
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];

        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Update payment status (e.g., Pending -> Paid)
const updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    try {
        const validStatuses = ['Pending', 'Paid', 'Failed'];

        if (!validStatuses.includes(paymentStatus)) {
            return res.status(400).json({ error: "Invalid payment status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({ message: "Payment status updated", order });
    } catch (error) {
        console.error("Error updating payment status:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
};
