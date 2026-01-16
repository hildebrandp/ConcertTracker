import * as fs from 'fs';
import * as path from 'path';
import YAML from 'yaml';
import express, { Application } from 'express';
import { json } from 'body-parser';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/routes';

const app: Application = express();

// Load the Swagger file
const swaggerFile = path.resolve(__dirname, './routes/openapi/openapi.json');
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = YAML.parse(swaggerData);

app.use(json()); // Middleware to parse JSON

// Basic CORS for local dev and simple deployments (override via CLIENT_ORIGIN if needed)
const clientOrigin = process.env.CLIENT_ORIGIN ?? '*';
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', clientOrigin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes); // Set up API routes

export default app;
