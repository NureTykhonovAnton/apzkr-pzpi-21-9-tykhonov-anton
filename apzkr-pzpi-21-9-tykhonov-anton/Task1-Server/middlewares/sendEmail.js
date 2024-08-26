const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS,  
    },
});

/**
 * Sends a danger alert email to a user if they are within an emergency zone.
 * 
 * @function sendDangerAlertEmail
 * @async
 * @param {Object} user - The user to send the email to.
 * @param {string} user.username - The username of the recipient.
 * @param {string} user.email - The email address of the recipient.
 * @param {Object} zone - The emergency zone information.
 * @param {string} zone.name - The name of the emergency zone.
 * @param {Object} zone.emergencyType - The type of emergency in the zone.
 * @param {string} zone.emergencyType.name - The name of the emergency type.
 * @param {string} zone.emergencyType.description - The description of the emergency type.
 * 
 * @throws {Error} Throws an error if the email fails to send.
 * 
 * @example
 * const sendDangerAlertEmail = require('./path/to/this/module');
 * 
 * const user = {
 *   username: 'JohnDoe',
 *   email: 'johndoe@example.com'
 * };
 * 
 * const zone = {
 *   name: 'Downtown',
 *   emergencyType: {
 *     name: 'Fire',
 *     description: 'A large fire has been reported in the area. Evacuate immediately.'
 *   }
 * };
 * 
 * sendDangerAlertEmail(user, zone)
 *   .then(() => console.log('Email sent'))
 *   .catch(err => console.error('Failed to send email:', err));
 */

const sendDangerAlertEmail = async (user, zone) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender address
            to: user.email,  // List of receivers
            subject: 'Emergency Alert: Danger in Your Area',  // Subject line
            text: `Dear ${user.username},

You are currently located within an emergency zone: ${zone.name}. Emergency type: ${zone.emergencyType.name} 

For your safety, please follow the evacuation instructions and head towards the nearest evacuation center.

Instructions are as follows:

        ${zone.emergencyType.description}

Stay safe,
Emergency Management Team`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Danger alert email sent successfully');
    } catch (error) {
        console.error('Error sending danger alert email:', error);
    }
};

module.exports = sendDangerAlertEmail;
