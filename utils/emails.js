const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
});

async function sendEmail(formUrl, fields) {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
            .container {
                max-width: 600px;
                margin: 0 auto;
                font-family: 'Roboto', sans-serif;
            }
            .card {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: #B8D861;
                padding: 32px;
                text-align: center;
            }
            .content {
                padding: 32px;
                color: #424242;
            }
            .button {
                background: #B8D861;
                color: white !important;
                padding: 12px 24px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 500;
                display: inline-block;
                margin: 16px 0;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(184, 216, 97, 0.3);
            }
            @media (max-width: 600px) {
                .container {
                    padding: 16px;
                }
                .content {
                    padding: 24px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="card">
                <div class="header">
                    <h1 style="color: white; margin:0; font-size: 28px;">Welcome Back! 👋</h1>
                </div>
                <div class="content">
                    <h2 style="margin-top: 0; color: #212121;">Hi there,</h2>
                    <p style="line-height: 1.6; font-size: 16px;">
                        We're excited to have you back! To continue providing you with the best experience, 
                        we need you to complete a quick form. It'll only take a few minutes!
                    </p>
                    <p style="line-height: 1.6; font-size: 16px;">
                        Click the button below to get started:
                    </p>
                    <center>
                        <a href=${formUrl} class="button" style="color: white;">Complete Form Now</a>
                    </center>
                    <p style="font-size: 14px; color: #757575;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            </div>
            <p style="text-align: center; color: #9e9e9e; font-size: 12px; margin-top: 24px;">
                © 2023 Your Company Name. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    `.replace(/\n/g, '').replace(/  +/g, '');

    try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM_ADDRESS,
      to: fields.email,
      subject: 'Estudio Titulos SMR',
      html: emailHTML
    });
  } catch (error) {
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

module.exports = {sendEmail};