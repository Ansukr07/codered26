const round = value => Math.round(value * 100) / 100

function roundedRoute(start, end, laneX) {
  const dy = end.y - start.y
  if (Math.abs(dy) < 1) return `M ${round(start.x)} ${round(start.y)} L ${round(end.x)} ${round(end.y)}`
  const dx = Math.sign(end.x - start.x)
  const directionY = Math.sign(dy)
  const radius = Math.min(8, Math.abs(laneX - start.x), Math.abs(end.x - laneX), Math.abs(dy) / 2)
  return `M ${round(start.x)} ${round(start.y)} H ${round(laneX - dx * radius)} Q ${round(laneX)} ${round(start.y)} ${round(laneX)} ${round(start.y + directionY * radius)} V ${round(end.y - directionY * radius)} Q ${round(laneX)} ${round(end.y)} ${round(laneX + dx * radius)} ${round(end.y)} H ${round(end.x)}`
}

/** Route left-side evidence into the frame and right-side outcomes out of it. */
export function getHeroConnections(frame, topics) {
  const routes = Array(topics.length)
  for (const side of ['left', 'right']) {
    const members = topics.map((topic, index) => ({ ...topic, index }))
      .filter(topic => side === 'left' ? topic.index < 3 : topic.index >= 3)
      .sort((a, b) => a.y - b.y)
      .map((topic, index, group) => ({
        ...topic,
        portY: frame.top + frame.height * (.2 + .6 * index / Math.max(1, group.length - 1)),
      }))
    const edge = side === 'left' ? frame.left : frame.right
    const directionX = side === 'left' ? -1 : 1
    const gap = Math.min(...members.map(topic => Math.abs(topic.x - edge)))
    const above = members.filter(topic => topic.y < topic.portY).sort((a, b) => a.y - b.y)
    const below = members.filter(topic => topic.y >= topic.portY).sort((a, b) => b.y - a.y)
    for (const group of [above, below]) {
      group.forEach((topic, rank) => {
        // The longest vertical branches stay nearest the frame, avoiding crossings.
        const laneX = edge + directionX * gap * (.3 + rank * .22)
        const port = { x: edge - directionX, y: topic.portY }
        const card = { x: topic.x, y: topic.y }
        const start = side === 'left' ? card : port
        const end = side === 'left' ? port : card
        routes[topic.index] = { path: roundedRoute(start, end, laneX), start, end, laneX }
      })
    }
  }
  return routes
}
