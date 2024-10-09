require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (reciverEmail) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"SkillUp Toeic 👻" <skilluptoeic@toeic.com>',
        to: reciverEmail,
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
    console.log("Message sent: %s", info.messageId);
}


module.exports = {
    sendSimpleEmail: sendSimpleEmail,


}