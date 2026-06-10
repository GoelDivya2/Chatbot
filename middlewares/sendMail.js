import nodemailer from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // IMPORTANT
      auth: {
        user: process.env.Gmail,
        pass: process.env.Password, // Gmail App Password only
      },
    });

    // verify connection first (important for debugging)
    await transporter.verify();
    console.log("✅ SMTP connected");

    const mailOptions = {
      from: process.env.Gmail,
      to: email,
      subject: subject,
      html: `
        <div style="text-align:center;font-family:Arial">
          <h2>OTP Verification</h2>
          <h1 style="color:blue">${otp}</h1>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ EMAIL SENT:", info.response);
    return true;

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    return false;
  }
};

export default sendMail;