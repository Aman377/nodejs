const responseMessage = require('../helpers/responseMessage')
const statusCode = require('../helpers/statusCode');
const cartService = require('../services/cartService')

exports.addCart = async (req, res) => {
    try {
        const cart = await cartService.addCart(req.body)
        res.status(statusCode.OK).json(cart)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const getCarts = await cartService.getCarts();
        res.status(statusCode.OK).json(getCarts)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getCartByUserId = async (req, res) => {
    try {
        const { id } = req.params
        const cart = await cartService.getCartByUserId(id)
        res.status(statusCode.OK).json(cart)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, err: err.message })
    }
}

exports.removeCartById = async (req, res) => {
    try {
        const { id } = req.params
        const cart = await cartService.removeCartById(id)
        res.status(statusCode.OK).json(cart)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, err: err.message })
    }
}