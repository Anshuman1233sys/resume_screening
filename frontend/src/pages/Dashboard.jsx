import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileDown, Users, TrendingUp, UsersRound, FileCheck, Percent, Clock } from 'lucide-react';
import './pages.css';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candRes, statsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/candidates'),
        axios.get('http://127.0.0.1:8000/api/dashboard-stats')
      ]);
      setCandidates(candRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getAvatarClass = (name) => {
    const char = name.charCodeAt(0);
    if (char % 3 === 0) return 'av-blue';
    if (char % 3 === 1) return 'av-purple';
    return 'av-indigo';
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Custom magnetic effect component
  const MagneticButton = ({ children, className, onClick }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = e.currentTarget.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);
      setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
    };

    const reset = () => {
      setPosition({ x: 0, y: 0 });
    };

    return (
      <motion.div
        className={`magnetic-box ${className}`}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your recruitment process.</p>
        </div>
      </div>

      <div className="hover-banner">
         <span className="dot"></span> Try hovering over the action buttons below - they magnetically attract your cursor!
      </div>

      {stats && (
        <div className="d-stats-row">
            <div className="d-stat-card card-plain">
                <div className="d-s-top">
                  <div>
                    <span className="label">Total Candidates</span>
                    <h2>{stats.total_candidates.value}</h2>
                  </div>
                  <div className="dsb-icon blue"><UsersRound size={20}/></div>
                </div>
                <div className="d-s-bottom positive">{stats.total_candidates.change} from last month</div>
            </div>
            
            <div className="d-stat-card card-plain">
                <div className="d-s-top">
                  <div>
                    <span className="label">Shortlisted</span>
                    <h2>{stats.shortlisted.value}</h2>
                  </div>
                  <div className="dsb-icon green"><FileCheck size={20}/></div>
                </div>
                <div className="d-s-bottom positive">{stats.shortlisted.change} from last month</div>
            </div>

            <div className="d-stat-card card-plain">
                <div className="d-s-top">
                  <div>
                    <span className="label">Screening Rate</span>
                    <h2>{stats.screening_rate.value}</h2>
                  </div>
                  <div className="dsb-icon purple"><Percent size={20}/></div>
                </div>
                <div className="d-s-bottom positive">{stats.screening_rate.change} from last month</div>
            </div>

            <div className="d-stat-card card-plain">
                <div className="d-s-top">
                  <div>
                    <span className="label">Avg. Processing</span>
                    <h2>{stats.avg_processing.value}</h2>
                  </div>
                  <div className="dsb-icon orange"><Clock size={20}/></div>
                </div>
                <div className="d-s-bottom negative">{stats.avg_processing.change} from last month</div>
            </div>
        </div>
      )}

      <div className="quick-actions-section">
          <h3>Quick Actions</h3>
          <p>Common tasks to streamline your recruitment workflow</p>
          <div className="qa-cards">
             <MagneticButton className="qa-card blue" onClick={() => navigate('/upload')}>
                <FileDown size={28} />
                <h4>Upload Resumes</h4>
                <p>Upload and screen new candidate resumes</p>
             </MagneticButton>

             <MagneticButton className="qa-card green" onClick={() => navigate('/candidates')}>
                <Users size={28} />
                <h4>View Candidates</h4>
                <p>Browse and filter all candidates</p>
             </MagneticButton>

             <MagneticButton className="qa-card orange" onClick={() => navigate('/shortlisted')}>
                <TrendingUp size={28} />
                <h4>Top Matches</h4>
                <p>View your shortlisted candidates</p>
             </MagneticButton>
          </div>
      </div>

      <div className="recent-candidates-section card-plain">
        <div className="rc-header">
           <div>
             <h3>Recent Top Candidates</h3>
             <p>Latest high-scoring candidates from your resume screening</p>
           </div>
           <button className="view-all-btn">View All →</button>
        </div>

        <div className="candidate-list">
          {candidates.map(candidate => (
            <div key={candidate.id} className="candidate-card-dash">
              <div className={`avatar ${getAvatarClass(candidate.name)}`}>
                {getInitials(candidate.name)}
              </div>
              <div className="candidate-info-dash">
                <h3>{candidate.name}</h3>
                <p className="role">{candidate.role || 'Unknown Role'}</p>
                <div className="skills-tags">
                  {candidate.skills && candidate.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="candidate-score-dash">
                 <div className="score-val"><strong>{candidate.match_score}</strong> / 100</div>
                 <div className="exp-val">{candidate.experience_years} years exp.</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
