// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API d\'authentification',
      version: '1.0.0',
      description: 'Une API simple avec Express, PostgreSQL, JWT',
    },
    servers: [
      {
        url: 'https://begainer-api.onrender.com',
      },
    ],
  },
  apis: ['./routes/*.js'], // <-- là où tu écris tes commentaires Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
