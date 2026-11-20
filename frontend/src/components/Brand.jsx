import { Code2 } from "lucide-react";

export default function Brand({ compact = false }) {
  return (
    <div className="brand-lockup">
      <span className="brand-mark">
        <Code2 size={21} strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="brand-name">
          devtrack<span>.</span>
        </span>
      )}
    </div>
  );
}
