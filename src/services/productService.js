const statusCode = require("../helpers/statusCode");
const responseMessage = require('../helpers/responseMessage');
const { Product } = require("../models/productsModel");
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

// Configure Multer for file upload
const uploadFilePath = path.resolve(__dirname, '../..', 'public/products');

const storage = multer.diskStorage({
    destination: uploadFilePath,
    filename(req, file, fn) {
        fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter(req, file, callback) {
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const isValidExtension = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
        const isValidMimeType = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype);

        if (isValidExtension && isValidMimeType) {
            return callback(null, true);
        }

        callback(new Error('Invalid file type. Only picture files of type PNG and JPG are allowed!'));
    },
}).single('photo');

exports.createProduct = async (req, res) => {
    try {
        // Handle image upload
        upload(req, res, async (error) => {
            if (error) {
                return { status: statusCode.BAD_REQUEST, message: error.message }
            }

            const { name, type, price, description } = req.body;

            const newProduct = await Product.create({
                name,
                type,
                price,
                photo: req.file ? req.file.filename : null,
                description
            });

            if (newProduct) {
                return { status: statusCode.CREATED, message: responseMessage.CREATE_PRODUCT, data: newProduct };
            } else {
                return { status: statusCode.OK, message: responseMessage.PRODUCT_NOT_CREATE };
            }
        });
    } catch (err) {
        console.error('Error creating product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
};

exports.getProducts = async () => {
    try {
        const products = await Product.find();
        products.forEach(product => {
            product.photo = process.env.IMAGE_URL + product.photo
        })
        return { status: statusCode.OK, message: responseMessage.ALL_PRODUCT, data: products }
    } catch (err) {
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message };
    }
}

exports.updateProduct = async (product, id) => {
    try {
        const productData = await Product.findOneAndUpdate({ _id: id }, product, { new: true });
        if (!productData) {
            return { status: statusCode.BAD_REQUEST, message: responseMessage.PRODUCT_NOT_UPDATE }
        }

        return { status: statusCode.OK, message: responseMessage.UPDATE_PRODUCT, data: productData }

    } catch (err) {
        console.error('Error update product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}

exports.getProductById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND }
    }
    try {
        const product = await Product.findById(id)
        return { status: statusCode.OK, message: responseMessage.PRODUCT_BY_ID, data: product }
    } catch (err) {
        console.error('Error get product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}

exports.getProductBySearch = async (search) => {
    try {
        const Products = await Product.find();
        const filteredProduct = Products.filter(prod =>
            prod.name.toLowerCase().includes(search.toLowerCase()) ||
            prod.type.toLocaleLowerCase().includes(search.toLocaleLowerCase)
        );
        if (filteredProduct.length != 0) {
            return { status: statusCode.OK, message: responseMessage.PRODUCT_BY_SEARCH, data: filteredProduct }
        } else {
            return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND }
        }
    } catch (err) {
        console.error('Error get product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}

exports.getProductByPaginationAndSearch = async (search, page) => {
    try {
        const Products = await Product.find()
        const filteredProduct = Products.filter(prod =>
            prod?.name.toLowerCase().includes(search.toLowerCase()) ||
            prod?.type.toLowerCase().includes(search.toLowerCase())
        ).slice(0, page)
        if (filteredProduct.length > 0) {
            return { status: statusCode.OK, message: responseMessage.PRODUCT_BY_SEARCH, data: filteredProduct }
        } else {
            return { status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND }
        }
    } catch (err) {
        console.error('Error get product:', err);
        return { status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message }
    }
}