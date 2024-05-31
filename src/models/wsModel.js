const mongoose = require("mongoose")

const wsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    message: String
})

const wsData = mongoose.model('wsModal', wsSchema);

module.exports = wsData