const nodemailer = require('nodemailer');

const sendMail = (options: any) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: `"Team Markets Center" <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        html: options.text
    }
    transporter.sendMail(mailOptions, function(err: string, info: string) {
        if(err){
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

module.exports = sendMail;