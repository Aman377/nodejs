const { User } = require('../models/userModel');
const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessage');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.Login = async (schema) => {
    try {
        const { email, password } = schema;
        //    Check email
        const user = await User.findOne({ email });
        if (!user) {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.EMAIL_NO_FOUND }
        }

        //    Check password
        const matchPass = await bcrypt.compare(password, user.password);
        if (matchPass) {
            const tokenPayload = {
                email: user.email,
                password: user.password
            }
            const token = jwt.sign(
                tokenPayload,
                "secret",
                {
                    expiresIn: "2h"
                }
            )
            return { status: statusCode.OK, message: responseMessage.LOGIN_USER, token: token, data: user }
        } else {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.INCORRECT_PASSWORD }
        }

    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.UserCreate = async (userSchema) => {
    try {
        const { name, email, password, mobileNo } = userSchema;

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashPassword, mobileNo
        });
        return { status: statusCode.CREATED, message: responseMessage.CREATE_USER, data: user };
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
};

exports.GetUser = async () => {
    try {
        const users = await User.find({}, 'name email mobileNo');
        return { status: statusCode.OK, message: responseMessage.GET_ALL_USER, data: users }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.UpdateUser = async (id, userSchema) => {
    try {
        if (!id || id.trim() === '') {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.ID_NOT_PROVIDE }
        }
        const userData = await User.findByIdAndUpdate(id, userSchema, { new: true });
        if (!userData) {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.USER_NOT_FOUND }
        }

        return { status: statusCode.OK, message: responseMessage.USER_PASSWORD }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}

exports.DeleteUser = async (id) => {
    try {
        await User.findByIdAndDelete(id)
        return { status: statusCode.OK, message: responseMessage.DELETE_USER }
    } catch (err) {
        return { status: statusCode.OK, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}