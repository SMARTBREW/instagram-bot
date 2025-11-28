const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const routes = require('./routes/v1');

const app = express();

// Morgan HTTP logging
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors());
app.options('*', cors());

// JWT authentication
passport.use('jwt', jwtStrategy);
app.use(passport.initialize());

// Health check endpoint
app.get('/health-check', (req, res) => {
  res.send('OK');
});

app.get('/running', (req, res) => {
  res.sendStatus(httpStatus.OK);
});

app.get('/', (req, res) => {
  res.send('Service running');
});

app.head('/', (req, res) => {
  res.sendStatus(httpStatus.OK);
});

// v1 api routes
app.use('/v1', routes);

// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;

