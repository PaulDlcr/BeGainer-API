// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

// Détermine l'URL en fonction de l'environnement
const apiUrl = process.env.NODE_ENV === 'production' 
  ? process.env.SWAGGER_API_URL_PROD
  : process.env.SWAGGER_API_URL_DEV;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BeGainer API',
      version: '1.0.0',
      description: 'Une API simple avec Express, PostgreSQL, JWT',
    },
    servers: [
      {
        url: apiUrl,
      },
    ],
  },
  apis: ['./routes/*.js'], // <-- là où tu écris tes commentaires Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
