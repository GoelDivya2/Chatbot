import nodemailer from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.Gmail,
        pass: process.env.Password,
      },
    });

    await transporter.verify();
    console.log("✅ SMTP connection verified");

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

    console.log("✅ Email sent successfully:", info.response);
    return true;

  } catch (error) {
    console.log("❌ FULL EMAIL ERROR:", error);
    return false;
  }
};

export default sendMail;