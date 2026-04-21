import { useState } from 'react';
import './pages.css';

export default function Settings() {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Manage your account settings and screening preferences</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-card card-plain">
          <div className="s-header">
             <h3>HR Manager</h3>
          </div>
          <div className="s-body">
             <div className="form-group">
                <label>Company</label>
                <input type="text" value="TechCorp Inc." readOnly />
             </div>
             <div className="s-action">
               <button className="btn-primary">Save Changes</button>
             </div>
          </div>
        </div>

        <div className="settings-card card-plain">
          <div className="s-header with-icon">
             <span className="icon purple">💼</span>
             <div>
               <h3>Screening Preferences</h3>
               <p>Configure how resumes are screened and ranked</p>
             </div>
          </div>
          <div className="s-body">
             <div className="form-group">
                <label>Minimum Match Score</label>
                <select defaultValue="70%">
                   <option>60%</option>
                   <option>70%</option>
                   <option>80%</option>
                </select>
                <span className="fs-hint">Only show candidates above this match score</span>
             </div>

             <div className="form-group">
                <label>Minimum Experience (years)</label>
                <select defaultValue="3+">
                   <option>1+ years</option>
                   <option>3+ years</option>
                   <option>5+ years</option>
                </select>
             </div>

             <div className="form-group">
                <label>Screening Criteria Priority</label>
                <div className="toggle-row">
                   <span>Skills Match</span>
                   <div className="toggle active"></div>
                </div>
             </div>
          </div>
        </div>

        <div className="settings-card card-plain">
          <div className="s-body">
             <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="••••••••" />
             </div>
             <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="••••••••" />
             </div>

             <div className="toggle-row with-hint">
                <div>
                  <strong>Two-Factor Authentication</strong>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <div className="toggle"></div>
             </div>

             <div className="s-action">
               <button className="btn-primary">Update Password</button>
             </div>
          </div>
        </div>

        <div className="danger-zone card-plain">
           <div className="s-header danger">
             <h3>Danger Zone</h3>
             <p>Irreversible actions that affect your account</p>
           </div>
           <div className="d-body">
              <div>
                <strong>Delete Account</strong>
                <p>Permanently delete your account and all data</p>
              </div>
              <button className="btn-danger">Delete Account</button>
           </div>
        </div>
      </div>
    </div>
  );
}
