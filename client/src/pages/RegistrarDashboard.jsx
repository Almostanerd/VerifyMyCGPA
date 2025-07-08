import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function RegistrarDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();

    
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://verifymycgpa-backend.onrender.com/registrar/records");
      const result = await res.json();

      if (result.success) {
        setRecords(result.data);
        console.log("Securely fetched via backend:", result.data);
      } else {
        alert("❌ Failed to fetch records securely.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("⚠️ Server error fetching records.");
    }
    setLoading(false);
  };

const handleApprove = async (record) => {
  const toEmail = record.student_email ;
  const recruiterEmail = record.recruiter_email;

  if (!recruiterEmail) {
    alert("❌ Recruiter email is missing. Cannot send verification.");
    return;
  }

  try {
    const res = await fetch('https://verifymycgpa-backend.onrender.com/send-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: record.id,
        name: record.name,
        cgpa: record.cgpa,
        toEmail: toEmail,
        recruiter_email: recruiterEmail
      }),
    });

    const result = await res.json();
    alert(result.message || '✅ Verification link sent!');
  } catch (err) {
    alert("❌ Error sending verification: " + err.message);
    console.error("❌ Backend error:", err);
  }
};


  const handleReject = async (id) => {

    console.log("🧪 Attempting to delete record with ID:", id);

     const res = await fetch("https://verifymycgpa-backend.onrender.com/reject-record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  const result = await res.json();

  /* const { error } = await supabase
      .from('cgpa_records')
      .update({ status: "rejected" }) // ✅ Don't delete; just mark
      .eq('id', id); */

    if (!result.success) {
       console.error("Supabase deletion error:", error.message);
      alert("❌ Failed to reject record.");
    } else {
      alert("🗑️ Record rejected.");
       setRecords((prev) => prev.filter((rec) => rec.id !== id)); // update UI instantly
      //fetchRecords(); // refresh
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-glow" />
       {/* 🔴 Logout Button at the top */}
    <div style={{ textAlign: 'right', padding: '1rem' }}>
      <button
        onClick={() => {
          //localStorage.removeItem("isRegistrar");
          sessionStorage.clear();
          window.location.replace("/registrar-login");
          //window.location.href = "/registrar";
          window.location.reload();
        }}
        className="dashboard-button red"
      >
        🚪 Logout
      </button>
    </div>

      <div className="dashboard-box">
        <h2 className="dashboard-title">📋 Registrar Panel</h2>
        {loading ? (
          <p className="dashboard-label">Loading...</p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {records.map((rec) => (
              <div
                key={rec.id}
                style={{
                  borderBottom: '1px solid #333',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <p className="dashboard-label">👤 {rec.name}</p>
                <p className="dashboard-label">🎓 CGPA: <span>{rec.cgpa}</span></p>
                <button
                  onClick={() => handleApprove(rec)}
                  className="dashboard-button"
                >
                  ✅ Approve & Send Link
                </button>
                <button
                  onClick={() => handleReject(rec.id)}
                  className="dashboard-button"
                  style={{ backgroundColor: '#ff4d4d', marginLeft: '1rem' }}
                >
                  ❌ Reject
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
  );
}

export default RegistrarDashboard;
