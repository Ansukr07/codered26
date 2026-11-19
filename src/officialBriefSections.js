import { getParticipantBrief } from './participantBriefs.js'

// A short source brief should not acquire invented requirements or empty sections.
export function getOfficialBriefSections(track) {
  const brief = getParticipantBrief(track.officialBrief?.number, track.briefOwner || track.slug)
  if (!brief) return [['problem', 'The challenge'], ['next', 'Register']]
  return [
    ['problem', 'The challenge', true],
    ['directions', 'Suggested directions', brief.directions?.length],
    ['focus', 'What to build', brief.required.length || brief.optional.length || brief.workflow],
    ['deliverables', 'Demo & deliverables', brief.deliverables.length],
    ['judging', 'Success criteria', brief.success.length || brief.evaluationNote],
    ['resources', 'Scope & constraints', brief.scope.length || brief.constraints.length],
    ['terms', 'Resources & help', brief.resources.length],
    ['next', 'Register', true],
  ].filter(([, , available]) => available).map(([id, label]) => [id, label])
}
