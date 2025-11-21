import React from "react";
import "./Toggle.css";

const Toggle = ({ value, onChange }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
