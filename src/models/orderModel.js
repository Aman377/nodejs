const mongoose = require("mongoose");
const Joi = require("joi")

const orderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    quantity: Number,
    price: {
        type: Number,
        default: null
    },
    city: String,
    address: String
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const orderJoiSchema = Joi.object({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    quantity: Joi.number().required(),
    city: Joi.string().required(),
    address: Joi.string().required()
})

const Order = mongoose.model('order', orderSchema)

module.exports = { Order, orderJoiSchema }