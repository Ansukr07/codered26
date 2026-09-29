import { useState, useRef, useEffect } from 'react';
import DottedArrow from "./DottedArrow";
import "./RegisterButton.css";

export default function RegisterButton({ onClick, onMouseEnter, onMouseLeave, href, size }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const pressTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(pressTimer.current);
  }, []);

  const handleMouseEnter = (e) => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsHovered(true);
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave(e);
  };

  const handleClick = (e) => {
    setIsPressed(true);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      setIsPressed(false);
    }, 5000);
    
    if (onClick) onClick(e);
  };

  const btnClass = `new-register-btn ${size === "large" ? "new-register-btn-large" : ""} ${(isHovered || isPressed) ? "is-expanded" : ""}`;
  
  const inner = (
    <>
      <div className="btn-inner-pill">
        <div className="arrows-container">
          <DottedArrow className="arrow-icon arrow-1" />
          <DottedArrow className="arrow-icon arrow-2" />
          <DottedArrow className="arrow-icon arrow-3" />
          <DottedArrow className="arrow-icon arrow-4" />
          <DottedArrow className="arrow-icon arrow-5" />
          <DottedArrow className="arrow-icon arrow-6" />
          <DottedArrow className="arrow-icon arrow-7" />
        </div>
      </div>
      <span className="btn-text">Register Now</span>
    </>
  );

  if (href) {
    return (
      <a 
        className={btnClass} 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button 
      className={btnClass} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {inner}
    </button>
  );
}
