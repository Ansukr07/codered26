// Total space recovered by the mobile hero's gap and button adjustments.
export const MOBILE_HERO_SPACE_BUDGET = 98

const clamp = value => Math.min(1, Math.max(0, value))

export function getMobileHeroCompression({ flowHeight, currentCompression = 0, viewportHeight, bottomSpace = 16 } = {}) {
  if (!Number.isFinite(flowHeight) || flowHeight <= 0 || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return 0

  const compression = Number.isFinite(currentCompression) ? clamp(currentCompression) : 0
  const breathingRoom = Number.isFinite(bottomSpace) && bottomSpace >= 0 ? bottomSpace : 16
  // Restore the preferred height before fitting, so repeated measurements stay stable.
  const preferredHeight = flowHeight + compression * MOBILE_HERO_SPACE_BUDGET
  return clamp((preferredHeight + breathingRoom - viewportHeight) / MOBILE_HERO_SPACE_BUDGET)
}
