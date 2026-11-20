import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import FormField from "../components/FormField.jsx";
import Alert from "../components/Alert.jsx";

const interests = [
  "Frontend development",
  "Backend development",
  "UI / UX design",
  "AI & machine learning",
  "Electronics",
  "Open source",
];
export default function SetupProfilePage() {
  const { user, completeProfile, logout } = useAuth();
  const [values, setValues] = useState({
    displayName: user?.name || "",
    role: "Student",
    institution: "",
    interests: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  function toggleInterest(item) {
    setValues((current) => ({
      ...current,
      interests: current.interests.includes(item)
        ? current.interests.filter((value) => value !== item)
        : [...current.interests, item],
    }));
  }
  async function submit(event) {
    event.preventDefault();
    if (!values.displayName.trim()) {
      setError("Please enter the name you want to use.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await completeProfile(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="form-panel setup-panel">
      <div className="step-indicator">
        <span className="step-active">01</span>
        <span className="step-line" />
        <span className="step-muted">PROFILE SETUP</span>
      </div>
      <div className="form-heading">
        <span className="form-kicker">MAKE IT YOURS</span>
        <h2>
          First, a little about you<span className="heading-period">.</span>
        </h2>
        <p>
          Personalize your workspace. You can always change these details later.
        </p>
      </div>
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={submit} className="form-stack">
        <FormField
          label="Display name"
          name="displayName"
          value={values.displayName}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              displayName: event.target.value,
            }))
          }
          placeholder="What should we call you?"
          icon={UserRound}
          required
        />
        <div className="field-wrap">
          <label className="field-label" htmlFor="role">
            I am a
          </label>
          <div className="select-shell">
            <GraduationCap size={17} />
            <select
              id="role"
              value={values.role}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  role: event.target.value,
                }))
              }
            >
              <option>Student</option>
              <option>Developer</option>
              <option>Designer</option>
              <option>Professional</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <FormField
          label="School, college or organization"
          name="institution"
          value={values.institution}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              institution: event.target.value,
            }))
          }
          placeholder="e.g. Your university"
          icon={BriefcaseBusiness}
        />
        <div className="field-wrap">
          <span className="field-label">What are you interested in?</span>
          <p className="field-hint interest-hint">
            Choose a few areas you'd like to focus on.
          </p>
          <div className="interest-grid">
            {interests.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => toggleInterest(item)}
                className={`interest-chip ${values.interests.includes(item) ? "interest-selected" : ""}`}
                aria-pressed={values.interests.includes(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="button-spinner" /> Saving profile…
            </>
          ) : (
            <>
              Finish setup <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
      <button
        className="subtle-button"
        type="button"
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      >
        Sign out instead
      </button>
    </section>
  );
}
