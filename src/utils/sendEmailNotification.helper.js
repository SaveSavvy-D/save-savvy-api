const transporter = require('../configs/mailerConfig');

function sendEmailNotification(to, subject, content) {
  const mailOptions = {
    from: 'support@savesavvy.com',
    to,
    subject,
    html: content,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = sendEmailNotification;
