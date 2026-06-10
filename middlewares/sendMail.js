import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (email, subject, otp) => {
  try {
    console.log("📩 Sending email to:", email);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial; text-align:center;">
          <h2>OTP Verification</h2>
          <h1 style="color:blue">${otp}</h1>
        </div>
      `,
    });

    console.log("✅ EMAIL SENT:", response);
    return true;

  } catch (error) {
    console.log("❌ EMAIL ERROR:", error);
    return false;
  }
};

export default sendMail;