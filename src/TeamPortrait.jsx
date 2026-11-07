export default function TeamPortrait({ src, name, eager, objectPosition, objectFit, scale, scaleOrigin, filter }) {
  const style = objectPosition || objectFit || scale || filter
    ? { objectPosition, objectFit, transform: scale ? `scale(${scale})` : undefined, transformOrigin: scaleOrigin, filter }
    : undefined

  return <div className="team-member-image">
    <img src={src} alt={name} loading={eager ? 'eager' : 'lazy'} decoding="async" style={style} />
  </div>
}
