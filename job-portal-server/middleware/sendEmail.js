const ses = require('../config/awsConfig');

const sendEmail = async (to, subject, body) => {
    const params = {
        // change this email
        Source: 'sampleEmail@hradvantageservices.com',
        Destination: {
            ToAddresses: [to]
        },
        Message: {
            Subject: {
                Data: subject,
                Charset: 'UTF-8'
            },
            Body: {
                Html: {
                    Data: body,
                    Charset: 'UTF-8'
                }
            }
        }
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log("Email sent successfully", result);
    } catch (error) {
        console.error("Error sending email", error);
    }
};

module.exports = sendEmail;