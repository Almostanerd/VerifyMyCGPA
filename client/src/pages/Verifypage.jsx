// client/src/pages/VerifyPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


function VerifyPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    try {
      const decoded = jwtDecode(token);

      setData(decoded);
    } catch (err) {
      console.error('Invalid token:', err);
      setInvalid(true);
    }
  }, [token]);

  return (
    <div className="verify-wrapper">
      <div className="dashboard-glow" />
      <div className="verify-box">
        {invalid ? (
          <h2 className="dashboard-title error">❌ Invalid or Expired Link</h2>
        ) : data ? (
          <>
            <h2 className="dashboard-title success">🎓 Verified CGPA</h2>
            <p className="dashboard-label">Name: <span>{data.name}</span></p>
            <p className="dashboard-label">CGPA: <span>{data.cgpa}</span></p>
          </>
        ) : (
          <h2 className="dashboard-title">Loading...</h2>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
