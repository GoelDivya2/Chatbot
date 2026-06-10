import nodemailer from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

   const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Gmail,
    pass: process.env.Password,
  },
});

    const mailOptions = {
      from: process.env.Gmail,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial; text-align:center;">
          <h1 style="color:red;">OTP Verification</h1>
          <p>Your OTP is:</p>
          <h2 style="color:#7b68ee;">${otp}</h2>
          <p>This OTP is valid for a short time.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);
    return true;

  } catch (error) {
    console.log("❌ Email error:", error.message);
    return false;
  }
};

export default sendMail;