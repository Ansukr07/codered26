import { renderToString } from 'react-dom/server'
import App from './App.jsx'

export function render(page) {
  return renderToString(<App initialPage={page} />)
}
