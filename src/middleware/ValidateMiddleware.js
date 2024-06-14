const statusCode = require("../helpers/statusCode");

const validateMiddleware = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(statusCode.BAD_REQUEST).json({
            status: statusCode.BAD_REQUEST,
            message: error.details[0].message
        });
    }
    next();
};

module.exports = validateMiddleware;