const statusCode = require("../../helpers/statusCode");
const { Product } = require("../models/productsModel");
const responseMessage = require('../../helpers/responseMessage');
const { Order } = require("../models/orderModel");

exports.addOrder = async (orderSchema) => {
    try {
        const { productId, userId, quantity, address, city } = orderSchema;

        const product = await Product.findById(productId);
        const totalPrice = quantity * product.price

        const addOrder = await Order.create({
            productId: productId,
            userId: userId,
            quantity: quantity,
            price: totalPrice,
            address: address,
            city: city
        });
        if (addOrder) {
            return { status: statusCode.CREATED, message: responseMessage.CREATE_ORDER, data: addOrder }
        } else {
            return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.ORDER_NOT_CREATE }
        }

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}