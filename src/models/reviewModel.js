const Joi = require('joi')
const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'product'
    },
    star: Number,
    message: String
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const reviewJoiSchema = Joi.object({
    user: Joi.string().required(),
    product: Joi.string().required(),
    star: Joi.number().required().min(0).max(5),
    message: Joi.string().required()
})

const Review = mongoose.model('review', ReviewSchema)

module.exports = { Review, reviewJoiSchema }