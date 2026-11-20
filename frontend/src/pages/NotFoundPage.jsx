import { Link } from "react-router-dom";
import Brand from "../components/Brand.jsx";
export default function NotFoundPage() {
  return (
    <main className="not-found">
      <Brand />
      <span className="form-kicker">404 — PAGE NOT FOUND</span>
      <h1>
        This page went off track<span className="heading-period">.</span>
      </h1>
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <Link className="primary-button button-link" to="/">
        Go to workspace
      </Link>
    </main>
  );
}
