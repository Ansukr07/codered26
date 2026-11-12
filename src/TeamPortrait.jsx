export default function TeamPortrait({ src, name, eager, objectPosition, objectFit, scale, scaleOrigin, filter }) {
  const filename = src.split('/').pop()
  const style = objectPosition || objectFit || scale || filter
    ? { objectPosition, objectFit, transform: scale ? `scale(${scale})` : undefined, transformOrigin: scaleOrigin, filter }
    : undefined

  return <div className="team-member-image">
    <img src={`/team/responsive/${filename}-400.webp`} srcSet={`/team/responsive/${filename}-400.webp 400w, /team/responsive/${filename}-800.webp 800w`} sizes="(max-width: 700px) 45vw, 25vw" alt={name} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'low'} decoding="async" width="400" height="520" style={style} />
  </div>
}
