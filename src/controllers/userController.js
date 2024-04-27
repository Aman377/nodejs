const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.UserCreate = async (req, res) => {
    try {
        const { name, email, password, mobileNo } = req.body
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name, email, password: hashPassword, mobileNo
        });
        res.status(200).json({ "status": 200, "message": "User added successfully", "data": user })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}