import { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import logoImage from './assets/logo.png';

const registrationUrl = 'https://unstop.com/o/qjIA3CN?utm_medium=Share&utm_source=ecell-bmsitm&utm_campaign=Online_coding_challenge';

const pageLinks = [
  ['home', 'Home'],
  ['tracks', 'Tracks'],
  ['prizes', 'Prizes'],
  ['schedule', 'Schedule'],
  ['faq', 'FAQ'],
];

const Navbar = ({ activePage = 'home', onNavigate = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const navRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const onPointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const showNotice = (message) => {
    setNotice(message);
    closeMenu();
  };

  const followPageLink = (page) => (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    onNavigate(page);
  };

  return (
    <>
      <nav ref={navRef} className={`custom-navbar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="navbar-header">
          <a className="nav-identity" href="#/home" onClick={followPageLink('home')} aria-label="CODERED home">
            <img src={logoImage} alt="" className="nav-logo-img" />
            <span className="nav-title">CODERED<span style={{ color: '#D90A16' }}>’26</span></span>
          </a>
          <button className={`nav-toggle ${isOpen ? 'open' : ''}`} type="button" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} aria-controls="navbar-dropdown" onClick={() => setIsOpen(open => !open)}>
            <span className="toggle-line line-1" />
            <span className="toggle-line line-2" />
          </button>
        </div>

        <div id="navbar-dropdown" className={`navbar-dropdown ${isOpen ? 'show' : ''}`} inert={!isOpen}>
          <ul className="nav-menu-list">
            {pageLinks.map(([page, label]) => (
              <li className="nav-menu-item" key={page}>
                <a href={`#/${page}`} aria-current={activePage === page ? 'page' : undefined} onClick={followPageLink(page)}>{label}</a>
              </li>
            ))}
          </ul>

          <div className="nav-footer">
            <button type="button" className="nav-btn-pitchdeck" onClick={() => showNotice('The PPT template is not available yet. Please check back for the official download.')}>PPT TEMPLATE</button>
            <div className="nav-footer-row">
              <a className="nav-btn-action" href={registrationUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>REGISTER NOW</a>
              <button type="button" className="nav-btn-action" onClick={() => showNotice('The brochure is not available yet. Please check back for the official download.')}>BROCHURE</button>
            </div>
          </div>
        </div>
      </nav>
      {notice && <div className="nav-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice">×</button></div>}
    </>
  );
};

export default Navbar;
