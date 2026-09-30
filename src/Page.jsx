import Sky from './sections/Sky.jsx';
import Header from './sections/Header.jsx';
import Ticks from './sections/Ticks.jsx';
import Menu from './sections/Menu.jsx';
import HeroProblem from './sections/HeroProblem.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import WhatWeBuilt from './sections/WhatWeBuilt.jsx';
import WhatsNew from './sections/WhatsNew.jsx';
import Demo from './sections/Demo.jsx';
import DemoDim from './sections/DemoDim.jsx';
import Roadmap from './sections/Roadmap.jsx';
import WhyAvoflare from './sections/WhyAvoflare.jsx';
import Footer from './sections/Footer.jsx';
import Security from './sections/Security.jsx';

// Page structure, in the order of the approved Home demo.
export default function Page() {
  return (
    <>
      <Sky />
      <Header />
      <Ticks />
      <Menu />
      <main id="top">
        <HeroProblem />
        <HowItWorks />
        <WhatWeBuilt />
        <WhatsNew />
        <Demo />
        <DemoDim />
        <Security />
        <Roadmap />
        <WhyAvoflare />
      </main>
      <Footer />
    </>
  );
}
