import { Request, Response, NextFunction } from 'express';

const mongoose = require("mongoose");
const createError = require('http-errors');
const routes = require('./routes/routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const express = require('express');
const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404));
});

// error handler
app.use((err: Error | undefined, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  if (err) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(500);
    res.render('error');
  } else {
    next();
  }

});

mongoose
  .connect(
    "mongodb://localhost:27017"
  )
  .then((res: any) => {
    if (res) {
      app.listen(8080, () => {
        console.log('Server running on http://localhost:8080');
      });
    }
  });
