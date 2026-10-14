export default function TeamPortrait({ src, name, eager }) {
  return <div className="team-member-image">
    <img src={src} alt={name} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  </div>
}