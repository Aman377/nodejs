const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const reviewController = require('../controllers/reviewController')
const token = require('../middleware/Authorization')
const validateMiddleware = require('../middleware/ValidateMiddleware')
const { orderJoiSchema } = require('../models/orderModel')
const { userJoiSchema } = require('../models/userModel')
const { productJoiSchema } = require('../models/productsModel')
const routesName = require("../common/routesName")
const { reviewJoiSchema } = require('../models/reviewModel')

// User routes
router.post(routesName.user, validateMiddleware(userJoiSchema), userController.UserCreate)
router.get(routesName.user, token, userController.GetUser)

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *                email: "example@gmail.com"
 *                password: "examplepassword"
 *     responses:
 *        200:
 *         description: User successfully login
 *         content:
 *           application/json:
 *             example:
 *               token: "JWT token here"
 *        400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               emailNotFound:
 *                 summary: Email not found
 *                 value:
 *                   message: "Email not found"
 *               passwordNotMatch:
 *                 summary: Invalid password provide
 *                 value:
 *                   message: "Invalid password provide"
 */

router.post(routesName.userLogin, userController.Login)
router.put(routesName.userById, token, userController.UpdateUser)
router.delete(routesName.userById, userController.DeleteUser)

// Product routes
router.post(routesName.product, token, validateMiddleware(productJoiSchema), productController.createProduct)
router.post(routesName.addMultipleProduct, token, productController.addMultipleProduct)
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

// Review Api
router.post(routesName.review, token, validateMiddleware(reviewJoiSchema), reviewController.addReview)
router.get(routesName.reviewById, token, reviewController.getTotalCalculateReview)

module.exports = router;