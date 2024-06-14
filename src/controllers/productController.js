const multer = require('multer');
const path = require('path');
const { Product } = require('../models/productsModel');
const statusCode = require('../../helpers/statusCode');
const responseMessage = require('../../helpers/responseMessage');
const { default: mongoose } = require('mongoose');
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
                return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: error.message });
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
    const id = req.params.productId;
    try {
        const productData = await Product.findOneAndUpdate({ _id: id }, product, { new: true });
        if (!productData) {
            return res.status(statusCode.BAD_REQUEST).json({ status: statusCode.BAD_REQUEST, message: responseMessage.PRODUCT_NOT_UPDATE })
        }

        return res.json({ status: statusCode.OK, message: responseMessage.UPDATE_PRODUCT, data: productData })

    } catch (err) {
        console.error('Error update product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(statusCode.NOT_FOUND).json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND })
    }
    try {
        const product = await Product.findById(id)
        return res.json({ status: statusCode.OK, message: responseMessage.PRODUCT_BY_ID, data: product })
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductBySearch = async (req, res) => {
    try {
        const { search } = req.query;
        const Products = await Product.find();
        const filteredProduct = Products.filter(prod =>
            prod.name.toLowerCase().includes(search.toLowerCase()) ||
            prod.type.toLocaleLowerCase().includes(search.toLocaleLowerCase)
        );
        if (filteredProduct.length != 0) {
            return res.json({ status: statusCode.OK, message: responseMessage.PRODUCT_BY_SEARCH, data: filteredProduct });
        } else {
            return res.json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND });
        }
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}

exports.getProductByPaginationAndSearch = async (req, res) => {
    try {
        const { search } = req.query
        const { page } = req.query
        const Products = await Product.find()
        const filteredProduct = Products.filter(prod =>
            prod?.name.toLowerCase().includes(search.toLowerCase()) ||
            prod?.type.toLowerCase().includes(search.toLowerCase())
        ).slice(0, page)
        if (filteredProduct.length > 0) {
            return res.json({ status: statusCode.OK, message: responseMessage.PRODUCT_BY_SEARCH, data: filteredProduct });
        } else {
            return res.json({ status: statusCode.NOT_FOUND, message: responseMessage.DATA_NOT_FOUND });
        }
    } catch (err) {
        console.error('Error get product:', err);
        res.status(statusCode.INTERNAL_SERVER_ERROR).json({ status: statusCode.INTERNAL_SERVER_ERROR, message: responseMessage.INTERNAL_SERVER_ERROR, error: err.message });
    }
}