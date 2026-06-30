import "dotenv/config";
import { google } from "googleapis";
import nodemailer from "nodemailer";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
// console.log("Refresh Token:", process.env.REFRESH_TOKEN);

// function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    // console.log("Sending email to:", to);
    const accessTokenResponse = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessTokenResponse.token,
      },
    });

    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    // console.log("Message Sent:", info.messageId);
  } catch (error) {
    console.error("Error Sending Email:", error);
  }
};

const sendRegisterationEmail = async (userEmail, name) => {
  const subject = "🎉 Welcome to Backend Ledger!";

  const text = `Hello ${name},

Welcome to Backend Ledger!

Your registration has been completed successfully.

We're excited to have you on board.

Best Regards,
Backend Ledger Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.1);">

<tr>
<td style="background:#2563eb;padding:30px;text-align:center;">
<h1 style="color:#fff;margin:0;">Backend Ledger</h1>
<p style="color:#dbeafe;margin-top:8px;">Registration Successful</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello ${name} 👋</h2>

<p style="font-size:16px;color:#555;line-height:1.8;">
Thank you for registering with <b>Backend Ledger</b>.
</p>

<p style="font-size:16px;color:#555;line-height:1.8;">
Your account has been created successfully.
We're excited to have you on board.
</p>

<div style="text-align:center;margin:35px 0;">
<a href="http://localhost:5173"
style="background:#2563eb;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">
Go to Dashboard
</a>
</div>

<hr>

<p style="color:#777;">
If you didn't create this account, you can safely ignore this email.
</p>

<p>
Best Regards,<br>
<b>Backend Ledger Team</b>
</p>

</td>
</tr>

<tr>
<td style="background:#f8fafc;padding:20px;text-align:center;color:#888;">
© 2026 Backend Ledger. All Rights Reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
};

const sendTransectionEmail = async (userEmail, name, amount, toAccount) => {
  const subject = "💸 Transaction Successful";

  const text = `Hello ${name},

Your transaction has been completed successfully.

Amount: ₹${amount}
Transferred To: ${toAccount}

Thank you for using Backend Ledger.

Best Regards,
Backend Ledger Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.1);">

<tr>
<td style="background:#16a34a;padding:30px;text-align:center;">
<h1 style="color:#fff;margin:0;">Backend Ledger</h1>
<p style="color:#dcfce7;margin-top:8px;">Transaction Successful</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello ${name} 👋</h2>

<p style="font-size:16px;color:#555;line-height:1.8;">
Your transaction has been completed successfully.
</p>

<table width="100%" cellpadding="10" cellspacing="0"
style="background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb;">

<tr>
<td><b>Amount</b></td>
<td>₹${amount}</td>
</tr>

<tr>
<td><b>Transferred To</b></td>
<td>${toAccount}</td>
</tr>

<tr>
<td><b>Status</b></td>
<td style="color:#16a34a;"><b>Successful</b></td>
</tr>

</table>

<div style="text-align:center;margin:35px 0;">
<a href="http://localhost:5173"
style="background:#16a34a;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">
View Dashboard
</a>
</div>

<hr>

<p style="color:#777;">
Thank you for trusting Backend Ledger for your transactions.
</p>

<p>
Best Regards,<br>
<b>Backend Ledger Team</b>
</p>

</td>
</tr>

<tr>
<td style="background:#f8fafc;padding:20px;text-align:center;color:#888;">
© 2026 Backend Ledger. All Rights Reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
};

const sendTransectionFailedEmail = async (
  userEmail,
  name,
  amount,
  fromAccount
) => {
  const subject = "❌ Transaction Failed";

  const text = `Hello ${name},

Unfortunately, your transaction could not be completed.

Amount: ₹${amount}
From Account: ${fromAccount}

Please verify your account balance and details before trying again.

Best Regards,
Backend Ledger Team`;

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 20px rgba(0,0,0,.1);">

<tr>
<td style="background:#dc2626;padding:30px;text-align:center;">
<h1 style="color:#fff;margin:0;">Backend Ledger</h1>
<p style="color:#fee2e2;margin-top:8px;">Transaction Failed</p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello ${name} 👋</h2>

<p style="font-size:16px;color:#555;line-height:1.8;">
Unfortunately, your transaction could not be completed.
</p>

<table width="100%" cellpadding="10" cellspacing="0"
style="background:#f8fafc;border-radius:8px;border:1px solid #e5e7eb;">

<tr>
<td><b>Amount</b></td>
<td>₹${amount}</td>
</tr>

<tr>
<td><b>From Account</b></td>
<td>${fromAccount}</td>
</tr>

<tr>
<td><b>Status</b></td>
<td style="color:#dc2626;"><b>Failed</b></td>
</tr>

</table>

<p style="font-size:16px;color:#555;line-height:1.8;margin-top:25px;">
Possible reasons:
</p>

<ul style="color:#555;line-height:1.8;">
<li>Insufficient balance.</li>
<li>Invalid account details.</li>
<li>Account is inactive or frozen.</li>
</ul>

<div style="text-align:center;margin:35px 0;">
<a href="http://localhost:5173"
style="background:#dc2626;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:bold;">
Try Again
</a>
</div>

<hr>

<p style="color:#777;">
If you believe this was a mistake, please contact our support team.
</p>

<p>
Best Regards,<br>
<b>Backend Ledger Team</b>
</p>

</td>
</tr>

<tr>
<td style="background:#f8fafc;padding:20px;text-align:center;color:#888;">
© 2026 Backend Ledger. All Rights Reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

  await sendEmail(userEmail, subject, text, html);
};
export {sendRegisterationEmail , sendTransectionEmail , sendTransectionFailedEmail};
