const responseMessage = require('../../helpers/responseMessage')
const statusCode = require('../../helpers/statusCode');
const cartService = require('../services/cartService')

exports.addCart = async (req, res) => {
    try {
        const cart = await cartService.addCart(req.body)
        res.status(statusCode.OK).json(cart)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getCarts = async (req, res) => {
    try {
        const getCarts = await cartService.getCarts();
        res.status(statusCode.OK).json(getCarts)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}