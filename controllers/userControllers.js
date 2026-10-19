
import sendMail from "../middlewares/sendMail.js";
import { User } from "../models/User.js";
import { Otp } from "../models/Otp.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email });
    }

    // Generate a six-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash OTP before storing it
    const otpHash = await bcrypt.hash(String(otp), 12);

    // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

   await Otp.findOneAndUpdate(
  { userId: user._id },
  { otpHash, expiresAt },
  {
    upsert: true,
    returnDocument: "after",
    runValidators: true,
  }
);

    await sendMail(email, "ChatBot", otp);

    // No verification JWT is needed
    return res.json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !/^\d{6}$/.test(String(otp ?? ""))) {
      return res.status(400).json({
        message: "Email and a valid six-digit OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or OTP",
      });
    }

    const otpRecord = await Otp.findOne({
      userId: user._id,
    });

    if (!otpRecord || otpRecord.expiresAt.getTime() <= Date.now()) {
      return res.status(400).json({
        message: "OTP expired or not found. Request a new OTP.",
      });
    }

    const isMatch = await bcrypt.compare(
      String(otp),
      otpRecord.otpHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong OTP",
      });
    }

    // Consume the OTP so it cannot be reused
    const consumed = await Otp.deleteOne({
      _id: otpRecord._id,
    });

    if (consumed.deletedCount !== 1) {
      return res.status(400).json({
        message: "OTP already used. Request a new OTP.",
      });
    }

    // Create login JWT only after successful verification
    const token = jwt.sign(
      { _id: user._id },
      process.env.Jwt_sec,
      { expiresIn: "5d" }
    );

    return res.json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
