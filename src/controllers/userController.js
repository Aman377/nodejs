const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');
const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessage');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService')

exports.UserCreate = async (req, res) => {
    try {
        const user = userService.UserCreate(req.body)
        res.status(statusCode.OK).json(user)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message })
    }
};

exports.GetUser = async (req, res) => {
    try {
        const users = await userService.GetUser()
        res.status(statusCode.OK).json(users)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message })
    }
}


exports.Login = async (req, res) => {
    try {
        const login = await userService.Login(req.body)
        res.status(statusCode.OK).json(login)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.UpdateUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.body
        const data = await userService.UpdateUser(id, user)
        res.status(statusCode.OK).json(data)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message })
    }
}

exports.DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.DeleteUser(id)
        res.status(statusCode.OK).json(user)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}
