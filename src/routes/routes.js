const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const token = require('../../middleware/Authorization')

// User routes
router.post('/user', userController.UserCreate)
router.get('/user', token, userController.GetUser)
router.post('/user/login', userController.Login)
router.put('/user/:id', token, userController.UpdateUser)
router.delete('/user/:id', userController.DeleteUser)

// Product routes
router.post('/product', token, productController.createProduct)
router.get('/product', token, productController.getProducts)
router.put('/product/:productId', token, productController.updateProduct)
router.get('/product/:id', token, productController.getProductById)
router.get('/product/search/data', token, productController.getProductBySearch)

module.exports = router;