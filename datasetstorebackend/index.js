const createError  = require('http-errors');
const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
// const fileUpload   = require('express-fileupload');
const upload       = require('./controllers/upload');
const preSignedUrl = require('./controllers/preSignedUrl');
const imageDetail  = require('./controllers/imageDetail');
const verification = require('./controllers/verification');

const index = express();

index.use(bodyParser.json());
index.use(logger('dev'));
// index.use(fileUpload());
// index.use(upload);
index.use(verification);
index.use(preSignedUrl);
index.use(imageDetail);

// catch 404 and forward to error handler
index.use(function(req, res, next) {
  next(createError(404));
});

// error handler
index.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const _port = process.env.PORT || 7000;
index.listen(_port,()=>{
  console.log(`Application Listen On Port ${_port}`);
});
