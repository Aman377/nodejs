const { Order, validateOrder } = "../models/orderModel"
const responseMessage = require('../../helpers/responseMessage')
const statusCode = require('../../helpers/statusCode')

exports.addOrder = async (req, res) => {
    try {
        const order = req.body;
        const { err } = validateOrder(order)
        if (err) {
            return res.status(statusCode.OK).json({ status: statusCode.BAD_REQUEST, message: err.details[0].message })
        }

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}