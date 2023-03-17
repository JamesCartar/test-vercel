if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const nodemailer = require('nodemailer');
const emailModel = require('../models/Email.js');

async function sendEmail() {
    const emailSetting = await emailModel.findOne({});

    let transport = nodemailer.createTransport({
        pool: true,
        host: emailSetting.host,  
        port: emailSetting.port,
        secure: emailSetting.secure, // use TLS
        auth: {
            user: emailSetting.authUser,
            pass: emailSetting.authPass,
        },
    });
    return transport
};

module.exports = sendEmail;
