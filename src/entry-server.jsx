import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import TeamPage from './TeamPage.jsx'

export function render(page) {
  return renderToString(<App initialPage={page} initialTeamPage={TeamPage} />)
}
