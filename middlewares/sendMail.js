import nodemailer from "nodemailer";
import dns from "dns";

// FORCE GLOBAL IPv4 ONLY (safe but not enough alone)
dns.setDefaultResultOrder("ipv4first");

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,

      auth: {
        user: process.env.Gmail,
        pass: process.env.Password,
      },

      // 🔥 CRITICAL FIX (this is what actually stops IPv6)
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { family: 4 }, callback);
      },
    });

    await transporter.verify();
    console.log("SMTP OK");

    const info = await transporter.sendMail({
      from: process.env.Gmail,
      to: email,
      subject,
      html: `<h2>Your OTP: ${otp}</h2>`,
    });

    console.log("EMAIL SENT:", info.response);
    return true;

  } catch (err) {
    console.log("FULL EMAIL ERROR:", err);
    return false;
  }
};

export default sendMail;