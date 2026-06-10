import nodemailer from "nodemailer";

const sendMail = async (email, subject, otp) => {
  try {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.GMAIL,     // ✅ FIXED (was Gmail)
        pass: process.env.PASSWORD,  // ✅ FIXED (was Password)
      },
      family: 4, // 🔥 FORCE IPv4 (fix ENETUNREACH error)
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>OTP Verification</title>
      </head>
      <body style="font-family: Arial; text-align:center;">
        <h1 style="color:red;">OTP Verification</h1>
        <p>Hello ${email}, your OTP is:</p>
        <h2 style="color:#7b68ee;">${otp}</h2>
      </body>
      </html>
    `;

    await transport.sendMail({
      from: process.env.GMAIL,
      to: email,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email error:", error);
  }
};

export default sendMail;