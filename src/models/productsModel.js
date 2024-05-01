const mongoose = require('mongoose');
const Joi = require('joi')

const ProductSchema = new mongoose.Schema({
    name: String,
    type: String,
    price: Number,
    photo: String,
    description: String,
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } })

const productJoiSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    price: Joi.number().required()
})

function validateProduct(product) {
    return productJoiSchema.valid(product)
}
const Product = mongoose.model('product', ProductSchema)

module.exports = { Product, validateProduct };