import { useEffect } from 'react';
import Page from './Page.jsx';
import { initSite } from './site.js';

export default function App() {
  useEffect(() => { initSite(); }, []);
  return <Page />;
}
