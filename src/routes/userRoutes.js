const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const token = require('../../middleware/Authorization')

router.post('/user', userController.UserCreate)
router.get('/user', token, userController.GetUser)
router.post('/user/login', userController.Login)
router.put('/user/:id', token, userController.UpdateUser)
router.delete('/user/:id', userController.DeleteUser)

module.exports = router;