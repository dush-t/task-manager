const sgMail = require('@sendgrid/mail');
const config = require('../../config/config') || undefined;

const sendgridAPIKey = process.env.SG_APIKEY || config.SG_APIKEY;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dushyant9309@gmail.com',
        subject: 'Thanks for joining!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dushyant9309@gmail.com',
        subject: 'Account cancelled',
        text: `Dear ${name}, we have cancelled your account as per your request. If possible, please let us know what we did wrong.`
    })
}


module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendCancelEmail: sendCancelEmail
}