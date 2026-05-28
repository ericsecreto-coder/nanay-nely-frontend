"use client";

import { useState } from "react";

type Props = {
  id: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
};

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "********",
  autoComplete,
  required,
  minLength
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        id={id}
        name={name}
        className="fi"
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
