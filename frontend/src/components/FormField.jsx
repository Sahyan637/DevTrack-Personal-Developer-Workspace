import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function FormField({ label, name, type = 'text', value, onChange, placeholder, error, autoComplete, required = false, hint, icon: Icon }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && visible ? 'text' : type;
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={name}>{label}{required && <span className="required-mark"> *</span>}</label>
      <div className={`input-shell ${error ? 'input-error' : ''}`}>
        {Icon && <Icon className="input-icon" size={17} />}
        <input id={name} name={name} type={inputType} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined} />
        {isPassword && <button className="visibility-button" type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button>}
      </div>
      {error && <p className="field-error" id={`${name}-error`}>{error}</p>}
      {!error && hint && <p className="field-hint" id={`${name}-hint`}>{hint}</p>}
    </div>
  );
}
