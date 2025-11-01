import React, { useState } from "react";
import "./Toggle.css";

const Toggle = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isOn}
        onChange={() => setIsOn(!isOn)}
      />
      <span className="slider"></span>
    </label>
  );
};

export default Toggle;
