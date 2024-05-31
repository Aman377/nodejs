const mongoose = require("mongoose")
const Joi = require("joi")

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number
    }
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } })

const cartJoiSchema = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
})

function validateCart(data) {
    return cartJoiSchema.valid(data)
}

const Cart = mongoose.model('cart', cartSchema)

module.exports = { Cart, validateCart }