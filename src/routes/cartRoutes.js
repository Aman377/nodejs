const express = require('express')
const router = express.Router()
const token = require('../middleware/Authorization')
const cartController = require('../controllers/cartController')
const validateMiddleware = require('../middleware/ValidateMiddleware')
const { cartJoiSchema } = require('../models/cartModel')

// Cart api
router.post('/', token, validateMiddleware(cartJoiSchema), cartController.addCart)
router.get('/', token, cartController.getCarts)
router.get('/:id', token, cartController.getCartByUserId)

module.exports = router