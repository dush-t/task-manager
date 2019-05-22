// index.js creates the express server and runs it.

const express = require('express');
require('./db/mongoose'); // calling require will ensure that the file runs.
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
try {
    const config = require('../config/config');
} catch (e) {
    console.log(e);
}



const app = express();
const port = process.env.PORT || config.PORT;

app.use(express.json()) // ask express to automatically parse incoming json.
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server is up on port " + port);
});

const Task = require('./models/task');
const User = require('./models/user');

