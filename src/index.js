const app = require('./app');

try {
    const config = require('../config/config');
} catch (e) {
    console.log(e);
}

const port = process.env.PORT || config.PORT;

app.listen(port, () => {
    console.log("Server is up on port " + port);
});