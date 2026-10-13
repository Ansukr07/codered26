import React from 'react';
import './sponsors.css';

const DotArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 24" fill="none">
    <circle cx="1.51169" cy="12.0732" r="1.35934" fill="currentColor" />
    <circle cx="4.79294" cy="12.0742" r="1.35934" fill="currentColor" />
    <circle cx="8.07223" cy="12.0757" r="1.35934" fill="currentColor" />
    <circle cx="11.3496" cy="12.0791" r="1.35934" fill="currentColor" />
    <circle cx="14.6308" cy="12.0805" r="1.35934" fill="currentColor" />
    <circle cx="17.9043" cy="12.0761" r="1.35934" fill="currentColor" />
    <circle cx="21.1855" cy="12.0771" r="1.35934" fill="currentColor" />
    <circle cx="17.9121" cy="15.2519" r="1.35934" fill="currentColor" />
    <circle cx="1.35934" cy="1.35934" r="1.35934" transform="matrix(1 0 0 -1 16.5469 10.2627)" fill="currentColor" />
    <circle cx="14.625" cy="18.4936" r="1.35934" fill="currentColor" />
    <circle cx="1.35934" cy="1.35934" r="1.35934" transform="matrix(1 0 0 -1 13.2637 7.01562)" fill="currentColor" />
    <circle cx="11.3515" cy="21.8232" r="1.35934" fill="currentColor" />
    <circle cx="1.35934" cy="1.35934" r="1.35934" transform="matrix(1 0 0 -1 9.98633 3.68701)" fill="currentColor" />
  </svg>
);

const SponsorCard = ({ href, name, logoSrc, logoClass, isComingSoon }) => {
  const isLink = Boolean(href);
  const Tag = isLink ? 'a' : 'div';
  const linkProps = isLink ? { href, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Tag {...linkProps} className="sponsors-grid__item" data-sponsor-item="">
      <div className="sponsors-top">
        <span className="sponsors-eyebrow">{name || 'Coming Soon'}</span>
        <span className="sponsors-brackets">
          <span data-sponsor-el="left">[</span>
          <span data-sponsor-el="arrow">{isComingSoon ? "—" : "\u2197"}</span>
          <span data-sponsor-el="right">]</span>
        </span>
      </div>
      {isComingSoon ? (
        <div className="sponsors-coming-soon">
          <span>Coming Soon</span>
        </div>
      ) : (
        <div className={`sponsors-logo ${logoClass}`}>
          <img src={logoSrc} alt={name} />
        </div>
      )}
    </Tag>
  );
};

export default function SponsorsSection() {
  return (
    <section id="sponsors" className="sponsors-section">
      <div className="sponsors-container">
        <div className="sponsors-header">
          <h2 className="sponsors-title">Sponsors</h2>
        </div>
        <div className="sponsors-bento">
          <div className="sponsors-grid-top">
            <SponsorCard href="https://www.hackerearth.com/" name="HackerEarth" logoSrc="/sponsors/hackerearth.svg" logoClass="is-hackerearth" />
            <SponsorCard href="https://unstop.com/" name="Unstop" logoSrc="/sponsors/unstop.svg" logoClass="is-unstop" />
          </div>
          <div className="sponsors-grid-bottom">
            <SponsorCard isComingSoon />
            <SponsorCard href="https://gen.xyz/" name=".xyz" logoSrc="/sponsors/xyz-logo-white.svg" logoClass="is-xyz" />
            <SponsorCard isComingSoon />
          </div>
        </div>
        <a className="sponsors-button" data-arrow-button="" href="https://drive.google.com/file/d/1R868KjV0qfIvK2croIpPDb5R0J6qH9JY/view" target="_blank" rel="noopener noreferrer">
          <div className="button-icon__wrap is--duplicate"><div className="button-icon"><DotArrowIcon /></div></div>
          <div className="button-text__wrap">
            <div className="text-wrap__innner">
              <span>Become a sponsor</span>
            </div>
          </div>
          <div className="button-icon__wrap is--main"><div className="button-icon"><DotArrowIcon /></div></div>
        </a>
      </div>
    </section>
  );
}
