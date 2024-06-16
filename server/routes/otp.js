import express from 'express';
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your Gmail email address
    pass: process.env.PASSWORD // Your Gmail password 
  }
});

let otpStore = {};

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  // Send OTP email
  const message = {
    from: 'SakibChatBot🤖 <Sakib@gmail.com>',
    to: email,
    subject: 'Your OTP Code For Verification 😃',
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is <b>${otp}</b></p>`
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);

    otpStore[email] = otp;
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
});

export default router;

