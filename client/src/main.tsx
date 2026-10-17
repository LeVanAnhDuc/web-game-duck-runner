// Phai nap truoc moi thu khac: no don ?code/?state khoi URL truoc khi game doc URL.
import './auth/duckerSession'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Play } from './views/Play'
import './styles/styles.css'

const root = document.getElementById('root')
if (root) createRoot(root).render(<StrictMode><Play /></StrictMode>)
