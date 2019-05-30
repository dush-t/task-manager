// index.js creates the express server and runs it.

const express = require('express');
require('./db/mongoose'); // calling require will ensure that the file runs.
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const clubRouter = require('./routers/club');
const joinRequestRouter = require('./routers/joinRequest');

const app = express();

// log all requests to terminal, just like django.
const loggerMiddleware = (req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
}

app.use(express.json()) // ask express to automatically parse incoming json.
app.use(loggerMiddleware);
app.use(userRouter);
app.use(taskRouter);
app.use(clubRouter);
app.use(joinRequestRouter);

module.exports = app;