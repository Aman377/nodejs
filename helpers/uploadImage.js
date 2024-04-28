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

// Function to handle image upload
const uploadImage = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (error) => {
      if (error) {
        reject(error);
      }

      resolve(req.file);
    });
  });
};

module.exports = { uploadImage };
