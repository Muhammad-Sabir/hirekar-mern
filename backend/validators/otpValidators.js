import { verifyOTP } from '../controllers/otpController.js';

export const otpValidator = async (req, res) => {
  const { email, otp } = req.body;

  try {
    await verifyOTP(email, otp);
    res.status(200).send('OTP verified successfully. Login complete.');
  } catch (error) {
    res.status(400).send(error.message);
  }
};
