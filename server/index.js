// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route to send verification email with JWT
// Route to send verification email to student + recruiter
app.post("/send-verification", async (req, res) => {
  const { student_id, name, cgpa, toEmail, recruiter_email } = req.body;

  console.log("📨 Incoming verification request:");
  console.log({ student_id, name, cgpa, toEmail, recruiter_email });

  const token = jwt.sign({ student_id, name, cgpa }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const link = `${process.env.FRONTEND_URL}/verify/${token}`;
  console.log("🔗 Generated link:", link);

  try {
    // Email to Student
    await transporter.sendMail({
      from: `"Registrar" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🎓 Your CGPA Verification Link",
      html: `<p>Hello ${name},</p>
             <p>Your CGPA has been approved.</p>
             <p>You can share this verification link: <a href="${link}">Verify CGPA</a></p>`,
    });
    console.log(`✅ Email sent to student: ${toEmail}`);

    // Email to Recruiter
    if (recruiter_email) {
      await transporter.sendMail({
        from: `"Registrar" <${process.env.EMAIL_USER}>`,
        to: recruiter_email,
        subject: "📄 CGPA Verification for " + name,
        html: `<p>Dear Recruiter,</p>
               <p>This is to verify the CGPA of ${name}.</p>
               <p>Click <a href="${link}">here</a> to view the official CGPA verification.</p>`,
      });
      console.log(`✅ Email sent to recruiter: ${recruiter_email}`);
    }

    // ✅ Mark the record as verified in Supabase
const { error: updateError } = await supabase
  .from('cgpa_records')
  .update({ status:"approved" })
  .eq('id', student_id);

if (updateError) {
  console.error("❌ Supabase update error:", updateError);
}


    res.json({ success: true, message: "Emails sent." });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/reject-record", async (req, res) => {
  const { id } = req.body;

  console.log("❌ Rejecting record:", id);

  const { error } = await supabase
    .from("cgpa_records")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) {
    console.error("❌ Rejection failed:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }

  res.json({ success: true, message: "Record rejected." });
});




// Route to decode and verify CGPA link
app.get("/verify/:token", (req, res) => {
  try {
    const data = jwt.verify(req.params.token, process.env.JWT_SECRET);
    res.json({ valid: true, data });
  } catch (err) {
    res.status(400).json({ valid: false, error: "Invalid or expired link." });
  }
});





app.get("/admin/cgpas", async (req, res) => {
  const { data, error } = await supabase.from("cgpa_records").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get("/registrar/records", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cgpa_records")
      .select("*")
      .eq("status", "pending") // ✅ Only show pending
        

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Error in /registrar/records:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(3001, () => {
  console.log("Server running on port 3001");
});


/*const express = require('express');
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
      html: `<p>Hello ${student_name},<br><br>Your CGPA has been verified.<br><br><a href="${link}">Click here to view it</a></p>`,
    });

    res.json({ message: '✅ Verification email sent!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; */