import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

    const response = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial; text-align:center;">
          <h2>OTP Verification</h2>
          <h1 style="color:blue">${otp}</h1>
          <p>This OTP is valid for verification.</p>
        </div>
      `,
    });

    console.log("✅ EMAIL SENT:", response.messageId);

    return true;
  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);

    return false;
  }
};

export default sendMail;