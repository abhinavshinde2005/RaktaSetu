const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const sendBloodRequestEmail = async (donorEmail, donorName, requesterName, bloodType, urgency, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: donorEmail,
    subject: `🩸 Urgent Blood Donation Request - ${bloodType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🩸 RaktaSetu</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #dc2626;">Hello ${donorName},</h2>
          <p><strong>${requesterName}</strong> needs ${bloodType} blood donation.</p>
          <div style="background: #fef2f2; padding: 20px; margin: 20px 0;">
            <p><strong>Urgency:</strong> ${urgency.toUpperCase()}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <a href="http://localhost:3001/requests.html" style="background: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block;">View Request</a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', donorEmail);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

const sendRequestStatusEmail = async (requesterEmail, requesterName, donorName, bloodType, status) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: requesterEmail,
    subject: `🩸 Blood Request ${status.toUpperCase()} - ${bloodType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🩸 RaktaSetu</h1>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #dc2626;">Hello ${requesterName},</h2>
          <p><strong>${donorName}</strong> has ${status} your blood donation request.</p>
          <a href="http://localhost:3001/requests.html" style="background: #dc2626; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block;">View Requests</a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Status email sent to:', requesterEmail);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return false;
  }
};

module.exports = { sendBloodRequestEmail, sendRequestStatusEmail };
