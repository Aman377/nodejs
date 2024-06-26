const responseMessage = require('../helpers/responseMessage')
const statusCode = require('../helpers/statusCode');
const orderService = require('../services/orderService')
require("dotenv").config();

exports.addOrder = async (req, res) => {
    try {
        const order = orderService(req.body)
        res.status(statusCode.OK).json(order)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getAllOrder = async (req, res) => {
    try {
        const order = await orderService.getAllOrder()
        res.status(statusCode.OK).json(order)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getWeatherCondition = async (req, res) => {
    try {
        const id = req.params.id;
        const apiKey = process.env.WEATHER_API_KEY
        const weather = await orderService.getWeatherCondition(id, apiKey)
        res.status(statusCode.OK).json(weather)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}