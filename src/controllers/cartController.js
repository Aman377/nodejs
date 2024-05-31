const { Cart, validateCart } = require('../models/cartModel')
const responseMessage = require('../../helpers/responseMessage')
const statusCode = require('../../helpers/statusCode');

exports.addCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body
        const { errCart } = validateCart(req.body)
        if (errCart) {
            return res.status(statusCode.OK).json({ status: statusCode.BAD_REQUEST, message: err.details[0].message })
        }
        const addCart = await Cart.create({
            userId,
            productId,
            quantity
        })
        if (addCart) {
            return res.json({ status: statusCode.CREATED, message: responseMessage.ADD_CART, data: addCart })
        } else {
            return res.json({ status: statusCode.BAD_REQUEST, message: responseMessage.ADD_NOT_CREATE })
        }

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('userId').populate('productId')
        if (carts) {
            return res.json({ status: statusCode.OK, message: responseMessage.ALL_CART, data: carts })
        } else {
            return res.json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND });
        }
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}