const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: String,
    mobileNo: Number
});

const userJoiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    mobileNo: Joi.number().integer().min(1000000000).max(9999999999)
});

function validateUser(user) {
    return userJoiSchema.validate(user);
}

const User = mongoose.model('users', userSchema);

module.exports = { User, validateUser };
