import { Check, Circle } from "lucide-react";
import { validatePassword } from "../utils/validation.js";

const rules = [
  ["At least 8 characters", (value) => value.length >= 8],
  ["One uppercase letter", (value) => /[A-Z]/.test(value)],
  ["One lowercase letter", (value) => /[a-z]/.test(value)],
  ["One number", (value) => /[0-9]/.test(value)],
];

export default function PasswordChecklist({ password }) {
  if (!password) return null;
  return (
    <div className="password-checklist" aria-label="Password requirements">
      {rules.map(([label, test]) => {
        const passed = test(password);
        return (
          <span className={passed ? "rule-passed" : "rule-pending"} key={label}>
            {passed ? <Check size={13} /> : <Circle size={12} />}
            {label}
          </span>
        );
      })}
      {validatePassword(password).length === 0 && (
        <span className="sr-only">All password requirements met.</span>
      )}
    </div>
  );
}
