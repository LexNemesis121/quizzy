// swaggerSetup.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express, { Request, Response } from 'express';

const router = express.Router();

const swaggerDefinition = {
  info: {
    title: 'Node.js Crowd Auth Reverse Proxy',
    version: '1.0.0',
    description: 'API documentation for authentication routes.',
  }
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/authRoutes.ts'], // Adjust the path based on your project structure
};

const specs = swaggerJsdoc(options);

// Serve the generated swagger.json
router.get('/swagger.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Serve Swagger UI
router.use('/', swaggerUi.serve, swaggerUi.setup(specs));

export default router;
