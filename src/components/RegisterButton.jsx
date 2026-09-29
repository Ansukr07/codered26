import DottedArrow from "./DottedArrow";
import "./RegisterButton.css";

export default function RegisterButton({ onClick, onMouseEnter, onMouseLeave, href, size }) {
  const btnClass = `new-register-btn ${size === "large" ? "new-register-btn-large" : ""}`;
  
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
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button 
      className={btnClass} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {inner}
    </button>
  );
}
