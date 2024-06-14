const statusCode = require("../helpers/statusCode");
const responseMessage = require('../helpers/responseMessage')
const { Cart } = require("../models/cartModel");

exports.addCart = async (cartData) => {
    try {
        const { userId, productId, quantity } = cartData

        const addCart = await Cart.create({
            userId,
            productId,
            quantity
        })
        if (addCart) {
            return { status: statusCode.CREATED, message: responseMessage.ADD_CART, data: addCart }
        } else {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.ADD_NOT_CREATE }
        }

    } catch (err) {
        console.error('Error creating product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.getCarts = async () => {
    try {
        const carts = await Cart.find().populate('userId').populate('productId')
        if (carts) {
            return { status: statusCode.OK, message: responseMessage.ALL_CART, data: carts }
        } else {
            return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND };
        }
    } catch (err) {
        console.error('Error creating product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.getCartByUserId = async (id) => {
    try {
        const carts = await Cart.find({ userId: id }).populate('userId').populate('productId')
        if (carts) {
            return { status: statusCode.OK, message: responseMessage.CART_BY_USER_ID, data: carts }
        } else {
            return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND }
        }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}