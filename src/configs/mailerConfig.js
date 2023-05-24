// dummy config

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'michale77@ethereal.email',
    pass: 'Kq2fxGed7k2M6dVMyE',
  },
});

module.exports = transporter;
