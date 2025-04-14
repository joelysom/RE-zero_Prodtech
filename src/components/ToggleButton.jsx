import { useState, useEffect } from "react";
import styles from "../styles/ToggleButton.module.css";

function ToggleButton() {
  const [isLightMode, setIsLightMode] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", !isLightMode);
    document.body.classList.toggle("light", isLightMode);
  }, [isLightMode]);

  const toggleMode = () => {
    setIsLightMode((prev) => !prev);
  };

  return (
    <div
      className={`${styles.wrapper} ${isLightMode ? styles.wrapperLight : ""}`}
      onClick={toggleMode}
    >
      <button
        className={`${styles.button} ${!isLightMode ? styles.buttonDark : ""}`}
      ></button>
    </div>
  );
}

export default ToggleButton;
