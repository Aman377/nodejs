const statusCode = require("../helpers/statusCode")
const responseMessage = require("../helpers/responseMessage")
const { Review } = require("../models/reviewModel")


exports.addReview = async (reviewSchema) => {
    try {
        const addReview = await Review.create(reviewSchema)
        if (addReview) {
            return { status: statusCode.OK, message: responseMessage.ADD_REVIEW, data: addReview }
        } else {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.REVIEW_NOT_ADDED }
        }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err }
    }
}

exports.getTotalCalculateReview = async (productId) => {
    try {
        const reviews = await Review.find({ product: productId }, '_id star message')
        const totalReview = reviews.reduce((acc, review) => acc + review.star, 0)
        const data = (totalReview / reviews.length).toFixed(1)
        const totalData = {
            "review": reviews,
            "total_review": data
        }
        return { "status": statusCode.OK, "message": responseMessage.REVIEW_BY_PRODUCT, "data": totalData }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err }
    }
}