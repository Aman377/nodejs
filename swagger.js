const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Demo API',
            version: '1.0.0',
            description: 'API documentation for demo api',
        },
    },
    servers:[
        {url:'http://localhost:8080/'},
      ],
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
