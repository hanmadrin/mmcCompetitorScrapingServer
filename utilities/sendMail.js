const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const json2csv = require('json2csv').parse;

// const processGmail = async({data,counts}) => {
//     const {data} = req.body;
//     // send gmail
//     const result = await sendMail({data});
    
// };
const auth = {
    type: "OAuth2",
    user: "hanurrad@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};


const sendMail  = async ({ fileName, fileContent, text, subject })=>{


    const to = [
        'michael@matthewsmotorcompany.com',
        'jason@matthewsmotorcompany.com',
        // 'josh@matthewsmotorcompany.com',
        'hashon.code@gmail.com',
        // 'mdhasanmahmudrimon@gmail.com'
    ]
    
    const mailoptions = {
        from: "Hasan <hanurrad@gmail.com>",
        to: to.join(','),
        subject: subject,
    }
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
          ...mailoptions,
          text: text,
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