import ps3 from './data/participant-ps3.json' with { type: 'json' }
import ps45 from './data/participant-ps45.json' with { type: 'json' }
import thinkRobotics from './data/participant-think-robotics.json' with { type: 'json' }
import agnesAI from './data/participant-agnes-ai.json' with { type: 'json' }
import cassetteLabs from './data/participant-cassette-labs.json' with { type: 'json' }
import sahasranshu from './data/participant-sahasranshu.json' with { type: 'json' }
import niveus from './data/participant-niveus.json' with { type: 'json' }

// Edited participant copy. Complete documents remain in each partner's source archive.
export const participantBriefs = [
  ...niveus.map(brief => ({ ...brief, trackSlug: 'niveus' })),
  ...[...ps3, ...ps45].map(brief => ({ ...brief, trackSlug: 'mystartupwave' })),
  ...thinkRobotics.map(brief => ({ ...brief, trackSlug: 'think-robotics' })),
  ...agnesAI.map(brief => ({ ...brief, trackSlug: 'agnes-ai' })),
  ...cassetteLabs.map(brief => ({ ...brief, trackSlug: 'cassette-labs' })),
  ...sahasranshu.map(brief => ({ ...brief, trackSlug: 'sahasranshu-technologies' })),
]

export function getParticipantBrief(number, trackSlug) {
  return participantBriefs.find(brief => brief.number === number && brief.trackSlug === trackSlug)
}
