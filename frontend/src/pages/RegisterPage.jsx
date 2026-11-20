import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import FormField from "../components/FormField.jsx";
import PasswordChecklist from "../components/PasswordChecklist.jsx";
import Alert from "../components/Alert.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateRegistration } from "../utils/validation.js";

export default function RegisterPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const change = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await register(values);
      navigate("/setup-profile", { replace: true });
    } catch (error) {
      setFormError(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-panel register-panel">
      <div className="form-heading">
        <span className="form-kicker">START SOMETHING GOOD</span>
        <h2>
          Create your account<span className="heading-period">.</span>
        </h2>
        <p>A little space to make a lot of progress.</p>
      </div>
      {formError && <Alert type="error">{formError}</Alert>}
      <form onSubmit={handleSubmit} noValidate className="form-stack">
        <FormField
          label="Full name"
          name="name"
          value={values.name}
          onChange={change}
          placeholder="Alex Morgan"
          autoComplete="name"
          error={errors.name}
          required
          icon={UserRound}
        />
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
        <div>
          <FormField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={change}
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password}
            required
          />
          <PasswordChecklist password={values.password} />
        </div>
        <FormField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={change}
          placeholder="Enter your password again"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
        />
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="button-spinner" /> Creating account…
            </>
          ) : (
            <>
              Create account <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
      <p className="form-switch">
        Already have an account?{" "}
        <Link className="text-link" to="/login">
          Sign in
        </Link>
      </p>
      <p className="legal-copy">
        By creating an account, you agree to use this demo responsibly. No real
        email is sent.
      </p>
    </section>
  );
}
