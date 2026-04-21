import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, PhoneCall } from 'lucide-react';
import './pages.css';

export default function Shortlisted() {
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({ average_score: 0, avg_experience: 0, ready_to_interview: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [candRes, statsRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/shortlisted'),
        axios.get('http://127.0.0.1:8000/api/stats')
      ]);
      setCandidates(candRes.data);
      setStats(statsRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="shortlisted-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Shortlisted Candidates</h1>
          <p>{candidates.length} top candidates selected for further review</p>
        </div>
        <button className="btn-primary">Compare All</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-info">
            <span>Average Score</span>
            <h2>{stats.average_score}</h2>
          </div>
          <div className="stat-icon blue">📈</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Avg. Experience</span>
            <h2>{stats.avg_experience} yrs</h2>
          </div>
          <div className="stat-icon purple">💼</div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span>Ready to Interview</span>
            <h2>{stats.ready_to_interview}</h2>
          </div>
          <div className="stat-icon green">⭐</div>
        </div>
      </div>

      <div className="shortlisted-list">
        {candidates.map(candidate => (
          <div key={candidate.id} className="shortlisted-card card-plain">
             <div className="s-card-top">
                <div className="s-card-profile">
                   <div className="avatar av-purple">{getInitials(candidate.name)}</div>
                   <div>
                     <h3>{candidate.name}</h3>
                     <p>{candidate.role}</p>
                     <span className="badge-shortlisted">⭐ Shortlisted</span>
                   </div>
                </div>
                <div className="s-card-actions-area">
                   <div className="score-block">
                     <h2>{candidate.match_score}<span>/ 100</span></h2>
                     <p>Match Score</p>
                   </div>
                   <div className="action-btns">
                     <button className="btn-primary schedule-btn"><Calendar size={16}/> Schedule Interview</button>
                     <button className="call-btn"><PhoneCall size={16}/> Call Now</button>
                   </div>
                </div>
             </div>

             <div className="contact-row">
                <span><Mail size={14}/> {candidate.email}</span>
                <span><Phone size={14}/> {candidate.phone}</span>
                <span><MapPin size={14}/> {candidate.location}</span>
             </div>

             <div className="info-area">
                <div className="key-skills">
                   <strong>Key Skills</strong>
                   <div className="skills-tags">
                     {candidate.skills.slice(0, 5).map((s,i) => <span key={i} className="skill-tag">{s}</span>)}
                   </div>
                </div>
             </div>

             <div className="exp-edu-row">
                <div className="ee-block">
                   <strong><Briefcase size={16}/> Experience</strong>
                   <p>{candidate.experience_years} years</p>
                </div>
                <div className="ee-block">
                   <strong><GraduationCap size={16}/> Education</strong>
                   <p>{candidate.education}</p>
                </div>
             </div>

             <div className="standout-box">
                <strong>✓ Why this candidate stands out:</strong>
                <ul>
                  {candidate.standout_points.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
