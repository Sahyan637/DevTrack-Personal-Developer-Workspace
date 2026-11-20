import { Outlet } from "react-router-dom";
import Brand from "../components/Brand.jsx";
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Layers3,
  ShieldCheck,
} from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="aside-top">
          <Brand />
        </div>
        <div className="aside-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> YOUR WORK, IN ONE PLACE
          </div>
          <h1>
            Make room for
            <br />
            <span>deep work.</span>
          </h1>
          <p className="aside-copy">
            A focused workspace for the things you're learning, building, and
            becoming.
          </p>
          <div className="feature-stack">
            <div className="feature-item">
              <span>
                <Layers3 size={18} />
              </span>
              <div>
                <strong>Stay organized</strong>
                <small>Bring projects and priorities together.</small>
              </div>
            </div>
            <div className="feature-item">
              <span>
                <CheckCircle2 size={18} />
              </span>
              <div>
                <strong>See your progress</strong>
                <small>Turn small steps into real momentum.</small>
              </div>
            </div>
            <div className="feature-item">
              <span>
                <ShieldCheck size={18} />
              </span>
              <div>
                <strong>Keep your focus</strong>
                <small>A calmer home for your developer life.</small>
              </div>
            </div>
          </div>
        </div>
        <div className="aside-bottom">
          <span>BUILT FOR CURIOUS MINDS</span>
          <span>
            EST. 2026 <ArrowUpRight size={13} />
          </span>
        </div>
        <div className="aside-decoration decoration-one" />
        <div className="aside-decoration decoration-two" />
      </aside>
      <main className="auth-main">
        <div className="mobile-brand">
          <Brand />
        </div>
        <div className="auth-content">
          <Outlet />
        </div>
        <footer className="auth-footer">
          <span>© 2026 DevTrack</span>
          <span>Learn deliberately. Build consistently.</span>
        </footer>
      </main>
    </div>
  );
}
