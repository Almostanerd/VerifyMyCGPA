import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import StudentDashboard from './pages/StudentDashboard';
import VerifyPage from './pages/Verifypage';
import RegistrarDashboard from './pages/RegistrarDashboard';
import RegistrarLogin from "./pages/RegistrarLogin";
import { useNavigate } from 'react-router-dom';

import './index.css';

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [isRegistrar, setIsRegistrar] = useState(false);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
  const loggedIn = localStorage.getItem("isRegistrar") === "true";
  setIsRegistrar(loggedIn);
}, []);


  const handleLogin = async () => {
    if (!email.trim()) return alert('Please enter your email!');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(`Login failed: ${error.message}`);
    else alert('✅ Magic link sent! Check your inbox.');
  };

  const LoginScreen = (
    <div className="login-container">
      <div className="login-box">
        <h1>🔐 VerifyMyCGPA</h1>
        <p>Enter your college email to receive a magic login link</p>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <label htmlFor="email">College Email</label>
          <input
            type="email"
            id="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Magic Link</button>
        </form>
        <p className="footer-text">Built with ❤️ using Supabase & React by Mugdha</p>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={session ? <StudentDashboard session={session} /> : LoginScreen} />
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route
  path="/registrar"
  element={
    isRegistrar ? (
      <RegistrarDashboard />
    ) : (
      <RegistrarLogin
        onLogin={() => {
          localStorage.setItem("isRegistrar", "true");
          setIsRegistrar(true);
        }}
      />
    )
  }
/>

      </Routes>
    </BrowserRouter>

    //<Route path="/registrar" element={<RegistrarDashboard />} /> 



  );
  
}

