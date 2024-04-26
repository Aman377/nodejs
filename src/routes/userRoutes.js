const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/user', userController.UserCreate)

module.exports = router;