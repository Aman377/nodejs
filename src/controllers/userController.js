const { User, validateUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const statusCode = require('../../helpers/statusCode');
const responseMessage = require('../../helpers/responseMessage');
const jwt = require('jsonwebtoken');

exports.UserCreate = async (req, res) => {
    try {
        const { name, email, password, mobileNo } = req.body;

        // Validation
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: error.details[0].message });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashPassword, mobileNo
        });
        res.status(statusCode.OK).json({ status: statusCode.CREATED, message: responseMessage.CREATE_USER, data: user });
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
};

exports.GetUser = async (req, res) => {
    try {
        const users = await User.find({}, 'name email mobileNo');
        return res.status(statusCode.OK).json({ status: statusCode.OK, message: responseMessage.GET_ALL_USER, data: users })
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}


exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //    Check email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(statusCode.OK).json({ status: statusCode.BAD_REQUEST, message: responseMessage.EMAIL_NO_FOUND })
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
            return res.status(statusCode.OK).json({ status: statusCode.OK, message: responseMessage.LOGIN_USER, token: token, data: user })
        } else {
            return res.status(statusCode.OK).json({ status: statusCode.OK, message: responseMessage.INCORRECT_PASSWORD })
        }

    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.UpdateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    try {
        const userData = await User.findByIdAndUpdate(id, user, { new: true });
        if (!id || id.trim() === '') {
            return res.json({ status: statusCode.BAD_REQUEST, message: responseMessage.ID_NOT_PROVIDE })
        }
        if (!userData) {
            return res.json({ status: statusCode.BAD_REQUEST, message: responseMessage.USER_NOT_FOUND })
        }

        return res.json({ status: statusCode.OK, message: responseMessage.USER_PASSWORD });
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.DeleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        return res.json({ status: statusCode.OK, message: responseMessage.DELETE_USER });
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}
