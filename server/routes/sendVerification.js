// server/routes/sendVerification.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/api/send-verification', async (req, res) => {
  const { student_email, student_name, student_cgpa } = req.body;

  try {
    const token = jwt.sign(
      { name: student_name, cgpa: student_cgpa },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const link = `https://yourdomain.com/verify/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: student_email,
      subject: '✅ CGPA Verification Link',
      html: `<p>Hello ${student_name},<br><br>Your CGPA has been verified.<br><br><a href="${link}">Click here to view it</a></p>`
    });

    res.json({ message: '✅ Verification email sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
