import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Check, Code2, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Brand from '../components/Brand.jsx';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.profile?.displayName?.trim().split(' ')[0] || user?.name?.split(' ')[0] || 'there';
  function handleLogout() { logout(); navigate('/login', { replace: true }); }
  return <div className="workspace-shell">
    <header className="workspace-header"><Brand /><div className="header-user"><span className="avatar">{firstName.charAt(0).toUpperCase()}</span><span className="header-user-name">{user?.profile?.displayName || user?.name}</span><button className="icon-button" onClick={handleLogout} aria-label="Log out" title="Log out"><LogOut size={17} /></button></div></header>
    <main className="workspace-main"><div className="workspace-welcome"><span className="form-kicker">YOUR WORKSPACE</span><h1>Good morning, {firstName}<span className="heading-period">.</span></h1><p>Your DevTrack account is ready. This is the starting point for your workspace.</p></div>
      <div className="welcome-card"><div className="welcome-card-content"><span className="welcome-icon"><Sparkles size={20} /></span><span className="form-kicker">MODULE 01 COMPLETE</span><h2>Your account is all set.</h2><p>You've completed registration, profile setup and sign-in. The next module will bring projects and tasks into this space.</p><div className="complete-pill"><Check size={14} /> Profile completed</div></div><div className="welcome-graphic"><div className="graphic-ring ring-one"/><div className="graphic-ring ring-two"/><div className="graphic-center"><Code2 size={42}/></div><span className="graphic-dot dot-one"/><span className="graphic-dot dot-two"/><span className="graphic-dot dot-three"/></div></div>
      <section className="profile-summary"><div className="section-title-row"><div><span className="form-kicker">ACCOUNT DETAILS</span><h3>Your profile</h3></div><span className="complete-pill"><Check size={14}/> Saved</span></div><div className="profile-grid"><div><span>Display name</span><strong>{user?.profile?.displayName || user?.name}</strong></div><div><span>Email address</span><strong>{user?.email}</strong></div><div><span>Role</span><strong>{user?.profile?.role || '—'}</strong></div><div><span>Organization</span><strong>{user?.profile?.institution || 'Not added'}</strong></div><div className="profile-interests"><span>Interests</span><div className="tag-list">{user?.profile?.interests?.length ? user.profile.interests.map((item) => <span className="tag" key={item}>{item}</span>) : <strong>Not selected</strong>}</div></div></div></section>
      <div className="next-module-note"><ArrowUpRight size={18}/><span><strong>What's next?</strong> Module 2 will introduce your personalized dashboard and project management.</span></div>
    </main>
    <footer className="workspace-footer">DEVTRACK <span>·</span> YOUR PERSONAL DEVELOPER WORKSPACE <button onClick={handleLogout}>Log out</button></footer>
  </div>;
}
