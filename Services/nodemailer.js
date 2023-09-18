const nodemailer = require("nodemailer");

function sendMail (destinationMail, subject, message) {
    const transporter = nodemailer.createTransport({
        service: "Locker",
        auth: {
            user: "auto@locker.com",
            pass: "automessage"
        }
    });
    const mailOptions = {
        from: "auto@locker.com",
        to: destinationMail,
        subject: subject,
        message: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if(error)
            throw error;
        else 
            return true;
    })
}

module.exports = {
    sendMail
}