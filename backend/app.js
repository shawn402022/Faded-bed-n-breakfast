//IMPORTS AND REQUIREMENTS

//imports the Express.js framework, which is used to create web applications and APIs in Node.js
const express = require('express');
//error handling for asynchronous routes and middleware
require('express-async-errors');
//logs HTTP requests to server
const morgan = require('morgan');
//Cross-Origin Resource Sharing - allows servers to indicate valid origins from which resources may be loaded onto browser. 
const cors = require('cors');
//used to protect against Cross-Site Request Forgery (CSRF)
const csurf = require('csurf');
//protects Express app by setting various security related HTTP headers
const helmet = require('helmet');
//parses the cookie header sent by browser
const cookieParser = require('cookie-parser');
//imports routes/index.js
const routes = require('./routes');
//imports environment variable from config/index.js
const { environment } = require('./config');
//boolean to determine if running in production
const isProduction = environment === 'production';
//initialize express application
const app = express();

const { ValidationError } = require('sequelize');

app.use(morgan('dev')); //log info about req and res

app.use(cookieParser());

app.use(express.json()); //parsing JSON bodies of req with content-type of "application/json"




//CORS
//implemented by browsers to restrict web pages from making requests to a different web page.
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

//CROSS ORIGIN POLICY (helmet)
// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({ // function allows control of which origins can embed your resources (EX:images, scripts, etc.)
      policy: "cross-origin" //cross origin means the origin of the resource is from a different protocol, domain or port number
    })                      //ex: images loaded from another site 
  );

//MIDDLEWARE FOR CSRF PROTECTION
// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
      cookie: { //tells csurf to use cookies for storing the CSRF token, rather than sessions.
        secure: isProduction, // Ensures the cookie is only transmitted over secure HTTPS connections (connection security), If isProduction is true sets the Secure flag on the cookie 
        sameSite: isProduction && "Lax",//Controls how cookies are sent with cross-site requests, "lax" - Cookies are sent when users navigate to the origin site from external sites.
        httpOnly: true //cookie will only be sent in http
      }
    })
  );

//This line MUST be after csurf
app.use(routes); //connect all routes to app

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});

module.exports = app;