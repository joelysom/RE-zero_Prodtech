import { useState, useEffect } from "react";
import "../styles/ToggleButton.css";

function ToggleButton() {
  const [isLightMode, setIsLightMode] = useState(true);
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
  }, [isLightMode]);

  const toggleMode = () => {
    setIsLightMode((prev) => !prev);
  };

  return (
    <div id="switch" onClick={toggleMode}>
      <button></button>
    </div>
  );
}

export default ToggleButton;
