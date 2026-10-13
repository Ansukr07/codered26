import { useEffect, useRef, useState } from 'react';
import './Navbar.css';
const logoImage = '/logos/Asset%2026.svg';

const pageLinks = [
  ['home', 'Home'],
  ['tracks', 'Tracks'],
  ['prizes', 'Prizes'],
  ['schedule', 'Schedule'],
  ['sponsors', 'Sponsors'],
  ['faq', 'FAQ'],
];

const Navbar = ({ activePage = 'home', onNavigate = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimeout = useRef(null);
  const navRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollAnchorY = useRef(0);
  const scrollDirection = useRef(0);

  const showNotice = (message) => {
    if (noticeTimeout.current) window.clearTimeout(noticeTimeout.current);
    setNotice(message);
    setIsOpen(false);
    noticeTimeout.current = window.setTimeout(() => {
      setNotice('');
      noticeTimeout.current = null;
    }, 3000);
  };

  useEffect(() => {
    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      setIsExpanded(currentY > 80);

      const delta = currentY - lastScrollY.current;
      const isMobile = window.matchMedia('(max-width: 700px)').matches;
      const topThreshold = isMobile ? 100 : 120;
      const hideAfter = isMobile ? 180 : 220;
      const hideDistance = isMobile ? 100 : 160;
      const showDistance = isMobile ? 24 : 40;

      if (isOpen) {
        setIsHidden(false);
        scrollAnchorY.current = currentY;
        scrollDirection.current = 0;
      } else if (currentY <= topThreshold) {
        setIsHidden(false);
        scrollAnchorY.current = currentY;
        scrollDirection.current = 0;
      } else if (Math.abs(delta) >= 2) {
        const direction = Math.sign(delta);
        if (direction !== scrollDirection.current) {
          scrollAnchorY.current = lastScrollY.current;
          scrollDirection.current = direction;
        }

        if (direction > 0 && currentY > hideAfter && currentY - scrollAnchorY.current >= hideDistance) {
          setIsHidden(true);
        } else if (direction < 0 && scrollAnchorY.current - currentY >= showDistance) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isOpen]);

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

  useEffect(() => {
    const onSiteNotice = (event) => showNotice(event.detail || 'Coming soon.');
    window.addEventListener('site-notice', onSiteNotice);
    return () => {
      window.removeEventListener('site-notice', onSiteNotice);
      if (noticeTimeout.current) window.clearTimeout(noticeTimeout.current);
    };
  }, []);

  const closeMenu = () => setIsOpen(false);

  const followPageLink = (page) => (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    onNavigate(page);
  };

  return (
    <>
      <nav ref={navRef} className={`custom-navbar ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''} ${isHidden ? 'nav-hidden' : ''}`} aria-label="Main navigation">
        <div className="navbar-header">
          <a className="nav-identity" href="/" onClick={followPageLink('home')} aria-label="CODERED home">
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
                <a
                  href={page === 'home' ? '/' : `/${page}`}
                  aria-current={activePage === page ? 'page' : undefined}
                  onClick={followPageLink(page)}
                >{label}</a>
              </li>
            ))}
          </ul>

          <div className="nav-footer">
            <button type="button" className="nav-btn-pitchdeck" onClick={() => showNotice('The PPT template is not available yet. Please check back for the official download.')}>PPT TEMPLATE</button>
            <div className="nav-footer-row">
              <button type="button" className="nav-btn-action" onClick={() => showNotice('Registration is coming soon. Please check back soon.')}>REGISTER NOW</button>
              <button type="button" className="nav-btn-action" onClick={() => showNotice('The brochure is not available yet. Please check back for the official download.')}>BROCHURE</button>
            </div>
          </div>
        </div>
      </nav>
      {notice && (
        <div className="nav-notice" role="status" aria-live="polite">
          <span>Coming soon!</span>
        </div>
      )}
    </>
  );
};

export default Navbar;
