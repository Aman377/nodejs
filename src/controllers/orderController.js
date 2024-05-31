const { Order, validateOrder } = require("../models/orderModel")
const responseMessage = require('../../helpers/responseMessage')
const statusCode = require('../../helpers/statusCode');
const { Product } = require('../models/productsModel');
const axios = require("axios")
require("dotenv").config();

exports.addOrder = async (req, res) => {
    try {
        const { productId, userId, quantity, address, city } = req.body;
        const { err } = validateOrder(req.body)
        if (err) {
            return res.status(statusCode.OK).json({ status: statusCode.BAD_REQUEST, message: err.details[0].message })
        }

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
            return res.json({ status: statusCode.CREATED, message: responseMessage.CREATE_ORDER, data: addOrder })
        } else {
            return res.json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.ORDER_NOT_CREATE })
        }

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('productId').exec();

        if (orders) {
            return res.json({ status: statusCode.OK, message: responseMessage.ALL_ORDER, data: orders })
        } else {
            return res.json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND });
        }
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