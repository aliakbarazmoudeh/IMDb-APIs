require('dotenv').config();
require('express-async-errors');

// main requirement for app
const express = require('express');
const app = express();
const connectDB = require('./db/connectDB');
const PORT = process.env.PORT || 5000;

// swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// rest packages
const cookieParser = require('cookie-parser');
// const rateLimiter = require('express-rate-limit');
// const helmet = require('helmet');
// const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

// use packages
// app.set('trust proxy', 1);
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000,
//     max: 60,
//   })
// );
// app.use(express.json());
// app.use(helmet());
// app.use(xss());
app.use(cors());
app.use(mongoSanitize());
app.use(cookieParser(process.env.JWT_SECRET));

// routes
const authRouter = require('./routes/authRoutes');
const movieRouter = require('./routes/movieRoutes');
const reviewRouter = require('./routes/reviewRoutes');

app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/reviews', reviewRouter);

// not found and errors handler
const errorHanlder = require('./middleware/error-handler');
const notFoundHanlder = require('./middleware/not-found');

app.use(errorHanlder);
app.use(notFoundHanlder);

// starting app
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log('connected to Database ...');
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
