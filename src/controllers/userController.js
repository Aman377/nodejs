const User = require('../models/userModel')

exports.UserCreate = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json({ "status": 200, "message": "User added successfully", "data": user })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }   
}