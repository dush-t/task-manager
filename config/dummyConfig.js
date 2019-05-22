// rename this file to config.js, update the parameters and save.

PORT=3000;      // you can change this if you want, doesn't matter in development mode.
SG_APIKEY=      // your sendgrid api key here;
JWT_SECRET=     // your jwt secret here - this can be any random string;
MONGODB_URL=    // your mongodb database url here;


module.exports = {
    PORT,
    SG_APIKEY,
    JWT_SECRET,
    MONGODB_URL
}