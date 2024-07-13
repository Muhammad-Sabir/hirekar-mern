import crypto from 'crypto';
import nodemailer from 'nodemailer';
import OTP from '../models/otpModel.js'

const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex'); 
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email',
      pass: 'password'
    }
  });

  const mailOptions = {
    from: 'email',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

export const createAndSendOTP = async (email) => {
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  const newOtp = new OTP({ email, otp, expires_at: expiresAt });
  await newOtp.save();

  await sendOTPEmail(email, otp);
};


export const verifyOTP = async (email, otp) => {
    const otpRecord = await OTP.findOne({ email, otp });
  
    if (!otpRecord) {
      throw new Error('Invalid OTP');
    }
  
    if (otpRecord.expires_at < new Date()) {
      throw new Error('OTP expired');
    }
  
    otpRecord.verified = true;
    await otpRecord.save();
  };
  