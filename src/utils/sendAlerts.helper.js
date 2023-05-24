const { Alert, Notification } = require('../models');
const sendEmailNotification = require('./sendEmailNotification.helper');

const sendAlerts = async (alertsToTrigger, user, category) => {
  const recipient = user.email;

  try {
    await Promise.all(alertsToTrigger.map(async (alert) => {
      const {
        title, description, thresholdPercentage, date,
      } = alert;

      const subject = `Alert: Expense Exceeded for ${title}`;
      const content = `Dear User,<br><br>

This is to notify you that your expense for ${title} has exceeded the assigned budget. Please find the details below:<br><br>

Category: ${category}<br>
Description: ${description}<br>
Budget Limit: ${thresholdPercentage}<br>
Date: ${date}<br>

We recommend reviewing your expenses and taking necessary actions to align with your budget limits.<br>

If you have any questions or need further assistance, please feel free to reach out to us.<br><br>

Best regards,<br>
Your Budget Management Team.<br>
`;

      await sendEmailNotification(recipient, subject, content);
      await Alert.findByIdAndUpdate(alert._id, { enabled: false });
      const newNotification = {
        alertId: alert._id,
        message: subject,
        userId: user.id,
      };

      const notification = await Notification.create(newNotification);

      console.log(notification);
    }));
  } catch (error) {
    console.error('Error occurred while sending email notifications:', error);
  }
};

module.exports = sendAlerts;
