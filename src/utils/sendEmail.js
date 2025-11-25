// utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // hoặc 465
      secure: false, // true cho 465, false cho các port khác
      auth: {
        user: process.env.EMAIL_USER, // Email của bạn (vd: myapp@gmail.com)
        pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng
      },
    });

    await transporter.sendMail({
      from: `"Votting by ndtitct" <${process.env.EMAIL_USER}>`, // Tên người gửi
      to: to, // Người nhận
      subject: subject, // Tiêu đề
      html: html, // Nội dung HTML
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
