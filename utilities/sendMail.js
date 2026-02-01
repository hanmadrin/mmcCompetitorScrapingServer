const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();


const auth = {
    type: "OAuth2",
    user: "hanurrad@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};

const sendMail = async ({ fileName, fileContent, text, subject }) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                ...auth,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: "Hasan <hanurrad@gmail.com>",
            to: [
                // 'michael@matthewsmotorcompany.com',
                // 'jason@matthewsmotorcompany.com',
                // 'josh@matthewsmotorcompany.com',
                'hashon.code@gmail.com',
                // 'mdhasanmahmudrimon@gmail.com'
            ].join(','),
            subject,
            text,
            attachments: [
                {
                    filename: fileName,
                    content: fileContent
                }
            ],
        };
        const result = await transport.sendMail(mailOptions);


        return {
            status: 'success',
            data: result
        };
    } catch (error) {
        console.log(error)
        throw new Error(error);
        return {
            status: 'error',
            data: error
        }
    }
}
const oAuth2Client = new google.auth.OAuth2(
    auth.clientId,
    auth.clientSecret,
    auth.redirectUri
);
oAuth2Client.setCredentials({ refresh_token: auth.refreshToken });



module.exports = {
    sendMail
};