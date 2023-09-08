const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const crypto = require("crypto");

module.exports.sendResetPassword = async ({
  name,
  email,
  subject,
  resetPasswordUrl,
}) => {
  // const OAuth2_Client = new OAuth2(
  //   process.env.CLIENT_ID,
  //   process.env.CLIENT_SECRET
  // );

  // OAuth2_Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  // const accessToken = OAuth2_Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      // accessToken: accessToken,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: `${subject} From NobleBazaar`,
    html: `<div>
      <h1>Hello ${name}</h1>
      <h3>This email is requested by you to reset your account password</h3>
      <h3>If you have not requested for password reset then please ignore this message</h3>
      <a
        href="${resetPasswordUrl}"
        style="
            background-color: #2a5ebd;
            text-decoration: none;
            font-family: sans-serif;
            font-weight: 600;
            color: #fff;
            padding: 7px 15px;
            border-radius: 7px 0 7px 0;
          ">
        CLICK TO RESET PASSWORD
      </a>
      <p><b>${resetPasswordUrl}</b></p>
    </div>`,
  });
};

module.exports.orderCancelEmail = async (order, reason) => {
  // const OAuth2_Client = new OAuth2(
  //   process.env.CLIENT_ID,
  //   process.env.CLIENT_SECRET
  // );

  // OAuth2_Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  // const accessToken = OAuth2_Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      // accessToken: accessToken,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to: order.userID.email,
    subject: `Order Canceled From NobleBazaar`,
    html: `<div>
      <h1>Hello ${order.userID.name}</h1>
      <h3>This email is to inform you that your order is canceled due to ${reason}</h3>
      <h5>Order id: ${order._id}</h5>
    </div>`,
  });
};
