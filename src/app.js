// index.js creates the express server and runs it.

const express = require('express');
require('./db/mongoose'); // calling require will ensure that the file runs.
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const clubRouter = require('./routers/club');
const joinRequestRouter = require('./routers/joinRequest');

const app = express();

app.use(express.json()) // ask express to automatically parse incoming json.
app.use(userRouter);
app.use(taskRouter);
app.use(clubRouter);
app.use(joinRequestRouter);

module.exports = app;