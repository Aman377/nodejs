const statusCode = require('../helpers/statusCode');
const responseMessage = require('../helpers/responseMessage');
require('dotenv').config();
const productService = require('../services/productService')

exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req, res)
        return res.status(statusCode.OK).json(product)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts()
        return res.status(statusCode.OK).json(products)
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const product = req.body;
        const id = req.params.productId;
        const productData = await productService.updateProduct(product, id)
        return res.status(statusCode.OK).json(productData)
    } catch (err) {
        console.error('Error update product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id)
        return res.status(statusCode.OK).json(product)
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductBySearch = async (req, res) => {
    try { 
        const { search } = req.query;
        const product = await productService.getProductBySearch(search)
        return res.status(statusCode.OK).json(product)
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductByPaginationAndSearch = async (req, res) => {
    try {
        const { search } = req.query
        const { page } = req.query
        const product = await productService.getProductByPaginationAndSearch(search, page)
        return res.status(statusCode.OK).json(product)
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.addMultipleProduct = async (req, res) => {
    try {
        const product = await productService.addMultipleProduct(req, res)
        return product
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}