import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function StudentDashboard({ session }) {
  const [cgpa, setCgpa] = useState('');
  const [name, setName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase
        .from('cgpa_records')
        .select('*')
        .eq('student_id', session.user.id)
        .order('created_at', { ascending: false }) // get latest first
  .limit(1)
  .maybeSingle(); // avoids crash if empty
        

      if (data) {
        setName(data.name);
        setCgpa(data.cgpa);
        setStudentEmail(session.user.email);
        setRecruiterEmail(data.recruiter_email || '');
        setSubmitted(true);
      }
    };

    loadData();
  }, [session.user.id]);

  const handleSubmit = async () => {

    const studentEmail = session.user.email;
    
      if (!name.trim() || !cgpa.trim() || !recruiterEmail.trim()) {
    alert("❌ Please fill in all fields before submitting.");
    return;
  }

  
  const cgpaValue = parseFloat(cgpa);
  if (isNaN(cgpaValue) || cgpaValue < 0 || cgpaValue > 10) {
    alert("🎓 CGPA must be a number between 0 and 10.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recruiterEmail)) {
    alert("📧 Please enter a valid recruiter email address.");
    return;
  }

    // Optional: prevent duplicate submissions to same recruiter
  const { data: existing } = await supabase
    .from('cgpa_records')
    .select('*')
    .eq('student_id', session.user.id)
    .eq('recruiter_email', recruiterEmail)
    .maybeSingle();

  if (existing) {
    alert("⚠️ You've already submitted for this recruiter.");
    return;
  }

    const { error } = await supabase.from('cgpa_records').insert([
      {
        student_id: session.user.id,
        name,
        cgpa,
        recruiter_email: recruiterEmail, // ✅ store recruiter email
        student_email: studentEmail,
      },
    ]);

    if (error) {
      console.error('Submission error:', error.message);
      alert('Submission failed: ' + error.message);
    } else {
      alert('✅ CGPA submitted!');
      setSubmitted(true);
    }
  };

    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("❌ Logout failed: " + error.message);
    } else {
      window.location.reload(); // refresh to return to login screen
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-glow" />
      <div className="dashboard-box">
        {submitted ? (
          <>
            <h2 className="dashboard-title success">✅ Submission Complete</h2>
            <p className="dashboard-label">Name: <span>{name}</span></p>
            <p className="dashboard-label">CGPA: <span>{cgpa}</span></p>
            <p className="dashboard-label">Recruiter Email: <span>{recruiterEmail}</span></p>
            <button onClick={handleLogout} className="dashboard-button red">
  🚪 Logout
</button>
    <button
      onClick={() => {
        setCgpa('');
        setName('');
        setRecruiterEmail('');
        setSubmitted(false);
      }}
      className="dashboard-button"
    >
      🔁 Submit for another recruiter
    </button>


          </>
        ) : (
          <>
            <h2 className="dashboard-title">🎓 Submit Your CGPA</h2>
            <input
              type="text"
              placeholder="Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dashboard-input"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Your CGPA"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="dashboard-input"
            />
            <input
              type="email"
              placeholder="Recruiter's Email"
              value={recruiterEmail}
              onChange={(e) => setRecruiterEmail(e.target.value)}
              className="dashboard-input"
            />
            <button onClick={handleSubmit} className="dashboard-button">
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
