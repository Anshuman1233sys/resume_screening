import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Upload, Users, Star, Settings, LogOut, Bell, Search } from 'lucide-react';
import classNames from 'classnames';

export default function Layout() {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Upload Resume', icon: Upload, path: '/upload' },
    { name: 'View Candidates', icon: Users, path: '/candidates' },
    { name: 'Shortlisted', icon: Star, path: '/shortlisted' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">ARS</div>
          <div className="logo-text">
            <strong>ARS</strong>
            <span>Resume Screening</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => classNames("nav-item", { active: isActive })}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search candidates..." />
          </div>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <div className="user-profile">
              <div className="user-info">
                <strong>Sarah Johnson</strong>
                <span>HR Manager</span>
              </div>
              <div className="user-avatar">SJ</div>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
