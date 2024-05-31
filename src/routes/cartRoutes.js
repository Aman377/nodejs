const express = require('express')
const router = express.Router()
const token = require('../../middleware/Authorization')
const cartController = require('../controllers/cartController')

// Cart api
router.post('/', token, cartController.addCart)
router.get('/', token, cartController.getCarts)

module.exports = router