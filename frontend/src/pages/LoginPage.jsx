import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import FormField from "../components/FormField.jsx";
import Alert from "../components/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { isValidEmail } from "../utils/validation.js";

export default function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!isValidEmail(values.email))
      nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Enter your password.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setFormError("");
    try {
      const user = await login(values);
      const destination = location.state?.from?.pathname;
      navigate(!user.profile ? "/setup-profile" : destination || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      setFormError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-panel">
      <div className="form-heading">
        <span className="form-kicker">WELCOME BACK</span>
        <h2>
          Good to see you<span className="heading-period">.</span>
        </h2>
        <p>Sign in to pick up where you left off.</p>
      </div>
      {formError && <Alert type="error">{formError}</Alert>}
      <form onSubmit={handleSubmit} noValidate className="form-stack">
        <FormField
          label="Email address"
          name="email"
          type="email"
          value={values.email}
          onChange={change}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          required
          icon={Mail}
        />
        <div className="field-group">
          <div className="field-topline">
            <label className="field-label" htmlFor="password">
              Password <span className="required-mark">*</span>
            </label>
            <Link className="text-link small-link" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <FormField
            name="password"
            type="password"
            value={values.password}
            onChange={change}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            required
          />
        </div>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="button-spinner" /> Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
      <p className="form-switch">
        New to DevTrack?{" "}
        <Link className="text-link" to="/register">
          Create an account
        </Link>
      </p>
      <div className="demo-note">
        <strong>Demo tip</strong>
        <span>
          Register a new account to try the complete flow. Your demo account is
          saved in this browser.
        </span>
      </div>
    </section>
  );
}
