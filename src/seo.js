import { trackRoutes } from './trackData.js'

export const siteUrl = 'https://www.codered26.xyz'
const trackPageTitle = ({ kind, track, brief }) => {
  if (kind === 'brief') return `${brief.fullTitle || brief.title} — ${track.title} ${track.briefKind === 'open-challenge' ? 'Open Challenge' : `PS ${brief.problemNumber}`} | Code Red 2026`
  if (kind === 'problems') return `${track.title} — ${track.subtracks?.length ? 'Company Tracks' : track.briefKind === 'open-challenge' ? 'Open Challenge' : 'Problem Statements'} | Code Red 2026`
  return `${track.title} — ${track.startupParent ? 'Startup Track' : `Track ${track.numeral}`} | Code Red 2026`
}
export const pages = {
  ...Object.fromEntries(trackRoutes.map(route => [route.page, {
    path: route.path,
    title: trackPageTitle(route),
    description: (route.brief || route.track).summary,
    isMock: (route.brief || route.track).isMock,
  }])),
  home: { path: '/', title: 'Code Red 2026 | 24-Hour Hackathon in Bengaluru | BMSIT&M', description: 'Join Code Red 2026, E-Cell BMSIT&M’s national 24-hour product sprint in Bengaluru on 28–29 December. Teams of 3–4 compete for a ₹2,25,000+ prize pool.' },
  about: { path: '/about', title: 'About Code Red 2026 | BMSIT&M Student Hackathon', description: 'Discover Code Red 2026 at BMSIT&M, Bengaluru: a national student product development sprint, online selection rounds and a 24-hour offline finale.' },
  tracks: { path: '/tracks', title: 'Hackathon Tracks & Problem Statements | Code Red 2026', description: 'Explore Niveus Solutions, Simple Energy, Agnes AI and Startup Track. Startup companies include Think Robotics, MyStartupWave, Sahasranshu Technologies and Cassette Labs.' },
  prizes: { path: '/prizes', title: '₹2,25,000+ Hackathon Prize Pool | Code Red 2026', description: 'See prizes and awards for Code Red 2026, the national 24-hour product development sprint at BMSIT&M, Bengaluru, with a total ₹2,25,000+ prize pool.' },
  schedule: { path: '/schedule', title: 'Hackathon Schedule & Timeline | Code Red 2026', description: 'See the Code Red 2026 schedule, from registration and online evaluation rounds to the 24-hour grand finale at BMSIT&M, Bengaluru.' },
  sponsors: { path: '/sponsors', title: 'Partners | Code Red 2026 at BMSIT&M', description: 'Meet the partners supporting student builders at BMSIT&M’s national product development sprint, Code Red 2026.' },
  team: { path: '/team', title: 'Meet the Team | Code Red 2026', description: 'Meet the student team behind Code Red 2026 at BMSIT&M, from coordinators to technology, design, marketing, events, relations, content and media.' },
  faq: { path: '/faq', title: 'Eligibility, Team Size, Fees & FAQs | Code Red 2026', description: 'Find Code Red 2026 answers about student eligibility, teams of 3–4, registration fees, hardware, hospitality and the 28–29 December finale in Bengaluru.' },
  notFound: { path: '/404', title: 'Page Not Found | Code Red 2026', description: 'This page could not be found. Explore Code Red 2026’s event details, tracks, prizes and frequently asked questions.' },
}

export function structuredData(page) {
  const url = siteUrl + pages[page].path
  const organization = { '@type': 'Organization', '@id': `${siteUrl}/#organizer`, name: 'E-Cell BMSIT&M', email: 'ecell@bmsit.in', sameAs: ['https://www.instagram.com/ecell.bmsit/', 'https://www.linkedin.com/company/ecellbmsit/'] }
  const graph = [organization, { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Code Red 2026', url: `${siteUrl}/`, publisher: { '@id': organization['@id'] } }, { '@type': 'WebPage', '@id': url, url, name: pages[page].title, description: pages[page].description, isPartOf: { '@id': `${siteUrl}/#website` } }]
  if (page === 'home') graph.push({ '@type': 'Event', '@id': `${siteUrl}/#event`, name: 'Code Red 2026', description: pages.home.description, url: `${siteUrl}/`, startDate: '2026-12-28', endDate: '2026-12-29', eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', image: [`${siteUrl}/images/group1.webp`], organizer: { '@id': organization['@id'] }, location: { '@type': 'Place', name: 'BMS Institute of Technology & Management', address: { '@type': 'PostalAddress', streetAddress: 'Doddaballapur Main Road, Avalahalli, Yelahanka', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', postalCode: '560064', addressCountry: 'IN' } } })
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function updateSeo(page) {
  const info = pages[page]
  document.title = info.title
  const setMeta = (attribute, name, content) => {
    let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, name); document.head.appendChild(element) }
    element.content = content
  }
  setMeta('name', 'description', info.description)
  setMeta('name', 'robots', page === 'notFound' || info.isMock ? 'noindex, follow' : 'index, follow, max-image-preview:large')
  for (const [name, value] of Object.entries({ 'og:title': info.title, 'og:description': info.description, 'og:url': siteUrl + info.path })) setMeta('property', name, value)
  setMeta('name', 'twitter:title', info.title)
  setMeta('name', 'twitter:description', info.description)
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
  canonical.href = siteUrl + info.path
  let schema = document.getElementById('site-schema')
  if (!schema) { schema = document.createElement('script'); schema.id = 'site-schema'; schema.type = 'application/ld+json'; document.head.appendChild(schema) }
  schema.textContent = JSON.stringify(structuredData(page))
}
