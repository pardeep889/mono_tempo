const { EmailClient } = require("@azure/communication-email");
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Azure Communication Services connection string
const connectionString = "endpoint=https://tempo-rg-email-resource.unitedstates.communication.azure.com/;accesskey=5WkYMdbgRrL8VN4JcDZkR7gtjsvFEBsZzd+yQ2sz0luEui3QTpekPrBkD3heIqEVQQRbBDM/Fn+sZd1VUqjc/w==";
const client = new EmailClient(connectionString);

// Function to send email with a template
async function sendEmail(recipientEmail, templateName, templateData) {
    try {
        // Read the email template file
        const templateFile = path.resolve(__dirname,'templates', `${templateName}.ejs`);
        const template = fs.readFileSync(templateFile, 'utf8');

        // Render the email template with EJS and provided data
        const htmlContent = ejs.render(template, templateData);

        // Email message configuration
        const emailMessage = {
            senderAddress: "DoNotReply@tempospace.co", // Verified sender address
            content: {
                subject: "Your Email Subject", // Customize the subject
                html: htmlContent,
            },
            recipients: {
                to: [{ address: recipientEmail }],
            },
        };

        // Send the email
        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();

        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
