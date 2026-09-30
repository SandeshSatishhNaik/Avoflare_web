import './loader.js'; // intro curtain: must run before the page paints
import 'lenis/dist/lenis.css';
import './styles/loader.css';
import './styles/site.css';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// No StrictMode: the page behaviour in site.js attaches once to the rendered DOM.
createRoot(document.getElementById('root')).render(<App />);
