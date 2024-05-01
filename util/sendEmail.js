const nodemailer = require("nodemailer");

const { AUTH_EMAIL, AUTH_PASS, MAIL_HOST } = process.env;

let transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  secure: false,
  port: 587,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
  tls:{
    rejectUnauthorized:true,
    minVersion:'TLSv1'
  }
});

//Test Transporter
transporter.verify((error, success) => {
  if (!success) {
    console.log(error);
  }
});

const sendEmail = async (mailOptions) => {
  try {
    return await transporter.sendMail(mailOptions);
    return;
  } catch (error) {
    throw error;
  }
};
module.exports = sendEmail;
