import './track-button-motion.css'

export default function TrackButtonContent({ children, arrow }) {
  return <>
    <span className="td-motion-text">
      <span className="td-motion-mask"><span className="td-motion-label">{children}</span></span>
      {arrow && <span className="td-motion-arrow td-motion-arrow--incoming" aria-hidden="true">{arrow}</span>}
    </span>
    {arrow && <span className="td-motion-arrow td-motion-arrow--main" aria-hidden="true">{arrow}</span>}
  </>
}
