const statusCode = require("../helpers/statusCode")
const responseMessage = require("../helpers/responseMessage")
const { addReview, getTotalCalculateReview } = require("../services/reviewService")
const readMail = require("../email/readMail")
const { OpenAI } = require("openai")


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

exports.readEmail = async (req, res) => {
    const folderName = req.params.folderName;
    const searchTerm = req.params.searchTerm;
    try {
        const emails = await readMail(folderName, searchTerm);
        if (emails.length > 0) {
            res.json(emails);
        } else {
            res.json({ "msg": "mail not found" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const aiAPi = async (question) => {
    const openai = new OpenAI({
        apiKey: "b839e8e786894482b701e08403acef9c",
        baseURL: "https://api.aimlapi.com",
    });

    const chatCompletion = await openai.chat.completions.create({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
            { role: "system", content: "You are a ai. Be descriptive and helpful" },
            { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 128,
    });

    return chatCompletion.choices[0].message.content;
};

exports.chatAi = async (req, res) => {
    try {
        question = req.body.question
        const data = await aiAPi(question)

        return res.status(200).json({ "status": 200, "data": data })

    } catch (error) {
        console.error("Error during OpenAI API call:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};