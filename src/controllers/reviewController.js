const statusCode = require("../helpers/statusCode")
const responseMessage = require("../helpers/responseMessage")
const { addReview, getTotalCalculateReview } = require("../services/reviewService")


exports.addReview = async (req, res) => {
    try {
        const review = await addReview(req.body)
        return res.json(review)
    } catch (err) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err })
    }
}

exports.getTotalCalculateReview = async (req, res) => {
    try {
        const productId = req.params.id
        const reviews = await getTotalCalculateReview(productId)
        return res.json(reviews)
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err }
    }
}