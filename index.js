const express = require('express');
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const userPreferencesRouter = require('./routes/user-preference');
const exercisesRouter = require('./routes/exercise');
const programsRouter = require('./routes/program'); 
const sessionRouter = require('./routes/session');
const sessionLogRouter = require('./routes/session-log');


const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Bonjour !"));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/exercises', exercisesRouter);
app.use('/api/programs', programsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/user-preferences', userPreferencesRouter);
app.use('/api', sessionLogRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
