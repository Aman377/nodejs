const statusCode = require("../helpers/statusCode");
const { Product } = require("../models/productsModel");
const responseMessage = require('../helpers/responseMessage');
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
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.getAllOrder = async () => {
    try {
        const orders = await Order.find().populate('userId').populate('productId').exec();

        if (orders) {
            return { status: statusCode.OK, message: responseMessage.ALL_ORDER, data: orders }
        } else {
            return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND };
        }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}