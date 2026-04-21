import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './pages.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="login-wrapper">
      <div className="login-header">
         <div className="logo-icon block-icon">ARS</div>
         <h1>Resume Screening System</h1>
         <p>Welcome back! Please login to continue.</p>
      </div>

      <div className="login-card">
         <h2>Login</h2>
         <p className="login-subtitle">Enter your credentials to access your account</p>

         <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
               <label>Email</label>
               <div className="input-with-icon">
                 <span>✉️</span>
                 <input type="email" placeholder="recruiter@company.com" required />
               </div>
            </div>

            <div className="form-group">
               <label>Password</label>
               <div className="input-with-icon">
                 <Lock size={16} color="#94a3b8" />
                 <input type="password" placeholder="••••••••" required />
               </div>
            </div>

            <div className="login-options">
               <label className="remember-me">
                 <input type="checkbox" /> Remember me
               </label>
               <a href="#" className="forgot-pw">Forgot password?</a>
            </div>

            <button type="submit" className="btn-primary w-full login-btn">Login</button>

            <div className="divider">
               <span>OR</span>
            </div>

            <button type="button" className="btn-secondary w-full create-btn">
               <span className="icon">👤</span> Create Account
            </button>
         </form>
      </div>
    </div>
  );
}
