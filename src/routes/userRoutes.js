const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const token = require('../../middleware/Authorization')

router.post('/user', userController.UserCreate);
router.get('/user', token, userController.GetUser);
router.post('/user/login',userController.login)

module.exports = router;