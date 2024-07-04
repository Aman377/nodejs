const express = require('express')
const router = express.Router()
const token = require('../middleware/Authorization')
const cartController = require('../controllers/cartController')
const validateMiddleware = require('../middleware/ValidateMiddleware')
const { cartJoiSchema } = require('../models/cartModel')

// Cart api

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: cart object to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: mongoose.Types.ObjectId
 *               productId:
 *                 type: mongoose.Types.ObjectId
 *               quantity:
 *                 type: Number
 *             example:
 *                userId: "662fd02022ad8116b470d1f5"
 *                productId: "662fd449da069687ddf40669"
 *                quantity: 1
 *     responses:
 *       201:
 *         description: Cart added successfully
 *         content:
 *           application/json:
 *             example:
 *               data: [{}]
 *       400:
 *         description: Cart not added
 */
router.post('/', token, validateMiddleware(cartJoiSchema), cartController.addCart)
router.get('/', token, cartController.getCarts)
router.get('/:id', token, cartController.getCartByUserId)
router.delete('/:id', token, cartController.removeCartById)

module.exports = router