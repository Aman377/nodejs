const { Order } = require("../models/orderModel")
const responseMessage = require('../helpers/responseMessage')
const statusCode = require('../helpers/statusCode');
const axios = require("axios")
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
    const id = req.params.id;
    const apiKey = process.env.WEATHER_API_KEY
    try {
        const order = await Order.findById(id)
        await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${order?.city}&appid=${apiKey}`)
            .then(response => {
                const weather = response?.data?.weather[0];
                if (weather) {
                    res.status(statusCode.OK).json({ status: statusCode.OK, message: responseMessage.CLIMATE_MSG, data: weather })
                } else {
                    res.status(statusCode.OK).json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND })
                }
            })
            .catch(err => {
                console.log("error occurs to get weather data", err);
            })
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}