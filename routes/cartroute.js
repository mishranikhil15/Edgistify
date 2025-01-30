const express = require("express");
const {
    createOrUpdateCart,
    getCartByUserId,
    removeProductFromCart,
    clearCart
} = require("../controllers/cartcontroller");
const authenticateUser = require("../middlewares/authentication");

const cartRouter = express.Router();

cartRouter.post("/", authenticateUser, createOrUpdateCart);

cartRouter.get("/:userId", authenticateUser,  getCartByUserId);

cartRouter.delete("/:userId/product/:productId", authenticateUser, removeProductFromCart);

cartRouter.delete("/:userId", authenticateUser, clearCart);

module.exports = { cartRouter };
