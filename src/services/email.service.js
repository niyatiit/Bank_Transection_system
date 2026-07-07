const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


async function sendRegistrationEmail(userEmail, name) {
   const html = `
<div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">
        
        <div style="background:#1E88E5; color:#fff; text-align:center; padding:25px;">
            <h1 style="margin:0;">Backend Ledger</h1>
            <p style="margin-top:8px;">Welcome to Secure Banking</p>
        </div>

        <div style="padding:35px;">
            <h2>Hello ${name} 👋</h2>

            <p>Thank you for registering with <strong>Backend Ledger</strong>.</p>

            <p>Your account has been created successfully and you're now ready to experience secure ledger-based banking transactions.</p>

            <div style="background:#E8F5E9; border-left:5px solid #43A047; padding:15px; margin:25px 0;">
                ✅ Registration completed successfully.
            </div>

            <p>Thank you for choosing us.</p>

            <p style="margin-top:35px;">
                Regards,<br>
                <strong>Backend Ledger Team</strong>
            </p>
        </div>

    </div>
</div>
`;
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
   const html = `
<div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,.1);">

        <div style="background:#2E7D32; color:white; text-align:center; padding:25px;">
            <h1 style="margin:0;">Transaction Successful</h1>
        </div>

        <div style="padding:35px;">

            <h2>Hello ${name},</h2>

            <p>Your transaction has been completed successfully.</p>

            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Amount</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">₹${amount}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Transferred To</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">${toAccount}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Status</strong></td>
                    <td style="padding:10px; color:green; border:1px solid #ddd;">
                        ✔ Successful
                    </td>
                </tr>
            </table>

            <p style="margin-top:30px;">
                Thank you for banking with Backend Ledger.
            </p>

            <p>
                Regards,<br>
                <strong>Backend Ledger Team</strong>
            </p>

        </div>

    </div>
</div>
`;
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const html = `
<div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px;">
    <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,.1);">

        <div style="background:#D32F2F; color:white; text-align:center; padding:25px;">
            <h1 style="margin:0;">Transaction Failed</h1>
        </div>

        <div style="padding:35px;">

            <h2>Hello ${name},</h2>

            <p>Unfortunately, your recent transaction could not be completed.</p>

            <table style="width:100%; border-collapse:collapse; margin-top:20px;">
                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Amount</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">₹${amount}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Recipient</strong></td>
                    <td style="padding:10px; border:1px solid #ddd;">${toAccount}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #ddd;"><strong>Status</strong></td>
                    <td style="padding:10px; color:red; border:1px solid #ddd;">
                        ✖ Failed
                    </td>
                </tr>
            </table>

            <div style="background:#FFF3E0; padding:15px; margin-top:25px; border-left:5px solid #FB8C00;">
                Please verify your account details or try again later.
            </div>

            <p style="margin-top:30px;">
                Regards,<br>
                <strong>Backend Ledger Team</strong>
            </p>

        </div>

    </div>
</div>
`;
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
};