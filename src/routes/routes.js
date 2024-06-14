const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const token = require('../middleware/Authorization')
const validateMiddleware = require('../middleware/ValidateMiddleware')
const { orderJoiSchema } = require('../models/orderModel')
const { userJoiSchema } = require('../models/userModel')
const { productJoiSchema } = require('../models/productsModel')
const routesName = require("../common/routesName")

// User routes
router.post(routesName.user, validateMiddleware(userJoiSchema), userController.UserCreate)
router.get(routesName.user, token, userController.GetUser)
router.post(routesName.userLogin, userController.Login)
router.put(routesName.userById, token, userController.UpdateUser)
router.delete(routesName.userById, userController.DeleteUser)

// Product routes
router.post(routesName.product, token, validateMiddleware(productJoiSchema), productController.createProduct)
router.get(routesName.product, token, productController.getProducts)
router.put(routesName.productByOwnId, token, productController.updateProduct)
router.get(routesName.productById, token, productController.getProductById)
router.get(routesName.searchProductData, token, productController.getProductBySearch)
router.get(routesName.searchProduct, token, productController.getProductByPaginationAndSearch)

// Order routes
router.post(routesName.order, token, validateMiddleware(orderJoiSchema), orderController.addOrder)
router.get(routesName.order, token, orderController.getAllOrder)

// Broadcasts api 
router.get(routesName.weatherById, token, orderController.getWeatherCondition)

module.exports = router;