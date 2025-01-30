const express = require("express");
const {
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus
} = require("../controllers/ordercontroller");

const authenticateUser = require("../middlewares/authentication");

const orderRouter = express.Router();

orderRouter.post("/", authenticateUser, createOrder);

orderRouter.get("/:userId", authenticateUser, getOrdersByUserId);

orderRouter.get("/:id", authenticateUser, getOrderById);

orderRouter.put("/:id/status", authenticateUser, updateOrderStatus);

orderRouter.put("/:id/payment", authenticateUser, updatePaymentStatus);

module.exports = { orderRouter };
