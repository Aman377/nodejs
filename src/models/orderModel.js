const { Double } = require("mongodb");
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
    price: Double,
    address: String
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const orderJoiSchema = Joi.object({
    productId: Joi.required().string(),
    userId: Joi.required().string(),
    quantity: Joi.required().number(),
    address: Joi.required().string(),
})

function validateOrder(data) {
    return orderJoiSchema.valid(data);
}

const Order = mongoose.model('order', orderSchema)

module.exports = { Order, validateOrder }