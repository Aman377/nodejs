const multer = require('multer');
const path = require('path');
const { Product, validateProduct } = require('../models/productsModel');
const statusCode = require('../../helpers/statusCode');
const responseMessage = require('../../helpers/responseMessage');
require('dotenv').config();

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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
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
                return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: error.message });
            }

            const { name, type, price, description } = req.body;

            const { errorProduct } = validateProduct(req.body);
            if (errorProduct) {
                return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: errorProduct.details[0].message });
            }

            const newProduct = await Product.create({
                name,
                type,
                price,
                photo: req.file ? req.file.filename : null,
                description
            });

            if (newProduct) {
                return res.status(statusCode.CREATED).json({ status: statusCode.OK, message: responseMessage.CREATE_PRODUCT, data: newProduct });
            } else {
                return res.status(statusCode.OK).json({ status: statusCode.OK, message: responseMessage.PRODUCT_NOT_CREATE });
            }
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log(process.env.IMAGE_URL);
        products.forEach(product => {
            product.photo = process.env.IMAGE_URL + product.photo
        })
        return res.json({ status: statusCode.OK, message: responseMessage.ALL_PRODUCT, data: products })
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.updateProduct = async (req, res) => {
    const product = req.body;
    const id = req.params

    try {
        const productData = await Product.findOneAndUpdate(id, product, { new: true });
        if (!productData) {
            return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: responseMessage.PRODUCT_NOT_UPDATE })
        }

        return res.json({ status: statusCode.OK, message: responseMessage.UPDATE_PRODUCT })

    } catch (err) {
        console.error('Error creating product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}