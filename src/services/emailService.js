require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (receiverEmail, result) => {
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
    to: receiverEmail,
    subject: "Hello from SkillUp Toeic ✔",
    text: "SkillUp Toeic",
    html: `
    <html>
  <head>
    <meta charset="UTF-8">
    <link rel="icon" type="image/png" href="https://res.cloudinary.com/practicetoeic/image/upload/v1732273629/logo_fwebn0.png">
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        color: #3333FF;
        text-align: center;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 14px;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="https://res.cloudinary.com/practicetoeic/image/upload/v1732273629/logo_fwebn0.png" alt="SkillUp Toeic Logo" style="width: 200px; display: block; margin: 0 auto;">
      <h1>Chào mừng đến với SkillUp Toeic</h1>
      <p>SkillUp Toeic xin chào,</p>
      <p>Chúng tôi rất vui mừng khi được chia sẻ với bạn một nguồn tài nguyên học tập tuyệt vời:</p>
      <p><b>Link:</b> <a href="${result}" target="_blank" style="color: #3333FF; text-decoration: none;">Click để xác nhận tài khoản ngay!</a></p>
      <p>Chúng tôi hy vọng website của chúng tôi sẽ giúp ích cho bạn trên hành trình luyện thi TOEIC!</p>
    </div>
    <div class="footer">
      <p>Trân trọng,</p>
      <p>SkillUp Toeic Team</p>
    </div>
  </body>
</html>
  `
  });
}

let sendVerificationEmail = async (receiverEmail, verificationCode) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: '"SkillUp Toeic 👻" <skilluptoeic@toeic.com>',
      to: receiverEmail,
      subject: "Your SkillUp Toeic Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `
          <html>
              <head>
                <meta charset="UTF-8">
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f9;
                          color: #333;
                          margin: 0;
                          padding: 0;
                      }
                      .container {
                          width: 80%;
                          margin: 0 auto;
                          padding: 20px;
                          background-color: #ffffff;
                          border-radius: 8px;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                      }
                      h1 {
                          color: #3333FF;
                          text-align: center;
                      }
                      p {
                          font-size: 16px;
                          line-height: 1.6;
                      }
                      .code {
                          font-size: 24px;
                          font-weight: bold;
                          color: #3333FF;
                          text-align: center;
                      }
                      .footer {
                          text-align: center;
                          margin-top: 40px;
                          font-size: 14px;
                          color: #777;
                        }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>Mã Xác Thực Của Bạn</h1>
                      <p>Cảm ơn bạn đã tin tưởng SkillUp Toeic!</p>
                      <p>Hãy nhập mã sau để xác thực tài khoản của bạn:</p>
                      <p class="code">${verificationCode}</p>
                      <p>Nếu bạn không phải bạn yêu cầu, vui lòng bỏ qua email này!</p>
                  </div>
                  <div class="footer">
                    <p>Trân trọng,</p>
                    <p>SkillUp Toeic Team</p>
                  </div>
              </body>
          </html>
          `,
    });
  } catch (error) {
    throw new Error("Failed to send verification email.");
  }
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendVerificationEmail: sendVerificationEmail,


}