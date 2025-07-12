# 🎓 VerifyMyCGPA – Tamper-Proof CGPA Verification Platform  
**React · Supabase · Node.js · JWT · Nodemailer · Vercel**

![Hackathon Submission](https://img.shields.io/badge/Hackathon-Project-blueviolet)
![Open Source](https://img.shields.io/badge/Status-Completed-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🚀 Overview
**VerifyMyCGPA** is a secure and decentralized academic verification system that allows students to **submit their CGPA** and have it verified instantly through **tamper-proof PDF tokens**, ensuring **trust, transparency, and recruiter confidence**.

> 🔒 Built with RLS (Row-Level Security), Supabase Auth, and JWT for end-to-end trust.  
> 📩 Instantly emails students and recruiters with digitally signed verification links.

---

## 🌟 Features
✅ OTP-based student login via **Supabase**  
✅ CGPA submission & student alerted when registrar verifies cgpa
✅ **Recruiter email alerts** with attached verification  
✅ Dynamic PDF tokens with **JWT anti-tamper layer**  
✅ Registrar access protected with RLS + secure backend routing  
✅ Fully responsive, **dark glowing UI**  


---



> 💡 *Live Demo *: [verifymycgpa.vercel.app](https://verify-my-cgpa.vercel.app/)

---

## 🛠️ Tech Stack

| Frontend | Backend | Auth & DB | Security | Emails |
|----------|---------|-----------|----------|--------|
| React.js | Node.js | Supabase  | JWT      | Nodemailer |

---

## 🧠 Inspiration
I noticed how students sometimes fake their CGPA while applying to offcampus internships and also,
**manual CGPA verifications** delay recruitment and hurt credibility. So, we built a **trustless verification layer** that institutions can adopt instantly — no extra infra, just secure logic.

---

## 🔐 Security Highlights
- **Supabase RLS** to prevent unauthorized access.
- Registrar backend routing: no direct Supabase access.
- Tamper proof links

---

## 👨‍💻 How It Works

1. **Student logs in** via OTP and enters CGPA.
2. CGPA is stored with **auto-locked access**.
3. Student enters recruiter’s email.
4. Registrar dashboard verifies & generates JWT token.
5. Emails sent to **student + recruiter** with attached token link.




