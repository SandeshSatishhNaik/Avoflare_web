// Converted from demos/home.html; behaviour lives in src/site.js.
export default function WhyAvoflare() {
  return (
    <section className="why" id="why" data-t="7140" aria-labelledby="h-why">      {' '}
<div className="wrap">        {' '}
<div className="why-head">          {' '}
<div><p className="bt-eyebrow rv">{"08 · WHY AVOFLARE"}</p><h2 id="h-why" className="rv">{"Why AVOFLARE, "}<em>{"and why now."}</em></h2></div>          {' '}
<p className="rv" style={{"--i": "1"}}>{"The engine is the part most likely to fail, and today the warning comes late. Here is why that should change, and why with AVOFLARE."}</p>          {' '}
</div>        {' '}
<div className="why-stakes" id="whyStakes">          {' '}
<p className="ws-k">{"THE STAKES"}</p>          {' '}
<div className="ws-grid">            {' '}
<div className="ws-fig"><b className="num" data-to="51" data-suf="%">{"0%"}</b><p>{"of failures in one widely used piston-engine UAV came from the powerplant."}</p>              {' '}
<div className="ws-bar" aria-hidden="true"><i /><span>{"Powerplant"}</span><em>{"Everything else"}</em></div></div>            {' '}
<div className="ws-fig"><b className="num" data-to="28.6" data-suf=" h" data-dec="1">{"0 h"}</b><p>{"mean time between failures for that same aircraft."}</p></div>            {' '}
<p className="ws-say">{"When the engine is the weak point, watching it closely is not optional."}</p>            {' '}
</div>          {' '}
<a className="src d" href="https://doi.org/10.3390/drones2010010" target="_blank" rel="noopener">{"Source · Piancastelli, Drones 2018, 2(1):10 · industry research, not an AVOFLARE result"}</a>          {' '}
</div>        {' '}
<div className="why-late" id="whyLate">          {' '}
<div className="wl-copy">            {' '}
<p className="bt-k">{"THE COST OF FINDING OUT LATE"}</p>            {' '}
<h3 className="bt-title">{"A threshold alarm fires at the failure. "}<em>{"A trend warning fires before it."}</em></h3>            {' '}
<p className="bt-note">{"Fixed alarm limits only trip once a reading is already out of bounds. Watching the trend against the twin gives the crew and the engineer time to act."}</p>            {' '}
<div className="wl-stat"><b className="num" data-to="25" data-from="18" data-range="1" data-suf=" %">{"18–25 %"}</b><span>{"lower maintenance costs in one analytics-driven maintenance programme"}</span></div>            {' '}
<a className="src" href="https://www.mckinsey.com/capabilities/operations/our-insights/establishing-the-right-analytics-based-maintenance-strategy" target="_blank" rel="noopener">{"Source · McKinsey & Company, 2021 · industry research"}</a>            {' '}
</div>          {' '}
<div className="wl-vis">            {' '}
<span className="wn-ill">{"ILLUSTRATIVE"}</span>            {' '}
<svg viewBox="0 0 560 300" className="wl-svg" id="wlSvg" aria-label="Illustration: engine condition slowly declines; a trend warning fires early, a threshold alarm only fires at failure; the gap between them is time to act"><g className="ax"><line x1="30" y1="260" x2="540" y2="260" /><line x1="30" y1="30" x2="30" y2="260" /><text x="540" y="282" textAnchor="end">{"time"}</text><text x="34" y="22">{"engine condition"}</text></g><line className="thr" x1="30" y1="214" x2="540" y2="214" /><text className="thr-t" x="536" y="206" textAnchor="end">{"alarm limit"}</text><rect className="gap" id="wlGap" x="250" y="30" width="0" height="230" /><path className="cond" id="wlCond" pathLength="1" d="M30 70 C 120 72, 190 80, 250 104 C 320 134, 380 176, 440 214 C 470 234, 490 248, 510 258" /><g className="mk early" id="wlEarly" transform="translate(250 104)"><circle r="7" /><g className="lbl"><rect x="-86" y="-46" width="172" height="28" rx="14" /><text y="-27" textAnchor="middle">{"AVOFLARE trend warning"}</text></g></g><g className="mk late" id="wlLate" transform="translate(440 214)"><circle r="7" /><g className="lbl"><rect x="-70" y="16" width="140" height="28" rx="14" /><text y="35" textAnchor="middle">{"Threshold alarm"}</text></g></g><text className="gap-t" id="wlGapT" x="345" y="52" textAnchor="middle">{"time to act"}</text></svg>            {' '}
</div>          {' '}
</div>        {' '}
<div className="why-fit">          {' '}
<div className="wf-head"><p className="bt-k">{"WHY IT FITS DEFENCE"}</p><h3 className="bt-title">{"Made for how military UAVs actually fly."}</h3></div>          {' '}
<ul className="why-tiles"><li className="why-tile" style={{"--n": "0"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5a13 13 0 0 1 18 0M6.5 13a8 8 0 0 1 11 0M10 16.5a3 3 0 0 1 4 0" /><path className="x" d="M3 3l18 18" /></svg><span className="why-chip">{"DESIGNED"}</span><h4>{"Keeps working when the link drops"}</h4><p>{"The on-board AI goes on watching the engine and deciding, then syncs with the ground when the link returns."}</p></li><li className="why-tile" style={{"--n": "1"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /><path className="q" d="M10 9.2a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.3M12 14.2v.1" /></svg><span className="why-chip">{"DESIGNED"}</span><h4>{"Every alert explains itself"}</h4><p>{"Each warning comes with the reading that moved, how far, and how sure the system is. Trust you can check."}</p></li><li className="why-tile" style={{"--n": "2"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /><path className="k" d="M15.5 17.5l1.8 1.8 3.2-3.6" /></svg><span className="why-chip">{"DESIGNED"}</span><h4>{"The engineer has the final say"}</h4><p>{"AVOFLARE recommends. A person approves. Nothing reaches the maintenance plan on its own."}</p></li><li className="why-tile" style={{"--n": "3"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2" /><path className="sh" d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.4" /></svg><span className="why-chip p">{"PLANNED"}</span><h4><a className="why-link" href="#security">{"Secure telemetry →"}</a></h4><p>{"Encrypted transfer, role-based access and integrity checks on every packet."}</p></li><li className="why-tile" style={{"--n": "4"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0z" /><path className="w" d="M12 16v5" /></svg><span className="why-chip">{"DESIGNED"}</span><h4>{"Fits what you already fly"}</h4><p>{"Built around CAN, the ECU/FADEC and the ground control station, so switching costs little."}</p></li><li className="why-tile" style={{"--n": "5"}}><svg className="why-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4" /><path className="fl" d="M5 4h13l-2.5 4L18 12H5" /></svg><h4>{"Built in India"}</h4><p>{"Indigenous engine intelligence for Indian MALE UAVs, in line with Atmanirbhar Bharat."}</p></li></ul>          {' '}
</div>        {' '}
<div className="why-roles">          {' '}
<div className="wr-head"><p className="bt-k">{"WHO GAINS"}</p><h3 className="bt-title">{"Pick a role."}</h3></div>          {' '}
<div className="wr-tabs" role="tablist" aria-label="Roles" id="wrTabs"><button type="button" role="tab" data-k="0" aria-selected="true">{"Maintenance technician"}</button><button type="button" role="tab" data-k="1" aria-selected="false" tabIndex="-1">{"Propulsion engineer"}</button><button type="button" role="tab" data-k="2" aria-selected="false" tabIndex="-1">{"UAV operator"}</button><button type="button" role="tab" data-k="3" aria-selected="false" tabIndex="-1">{"Mission planner"}</button><button type="button" role="tab" data-k="4" aria-selected="false" tabIndex="-1">{"Fleet manager"}</button><button type="button" role="tab" data-k="5" aria-selected="false" tabIndex="-1">{"MRO and engine makers"}</button><i className="wr-ind" id="wrInd" aria-hidden="true" /></div>          {' '}
<div className="wr-stage"><div className="wr-card" id="wrCard" role="tabpanel" aria-live="polite" data-roles="Maintenance technician~Less troubleshooting. A targeted plan says which part to check, and why.|Propulsion engineer~Early warnings and slow drifts that manual monitoring misses, each with its evidence.|UAV operator~Live engine monitoring in flight. The on-board AI keeps watching even when the link drops.|Mission planner~Aircraft ranked by predicted engine health before a mission is assigned.|Fleet manager~One health view across the whole fleet: which aircraft are ready, which need attention.|MRO and engine makers~Shared fleet health makes maintenance faster and cheaper; real flight patterns feed better engine design."><p className="wr-role" id="wrRole">{"Maintenance technician"}</p><p className="wr-text" id="wrText">{"Less troubleshooting. A targeted plan says which part to check, and why."}</p><span className="wr-note">{"Designed benefits, not yet measured in service."}</span></div></div>          {' '}
</div>        {' '}
<div className="why-now" id="whyNow">          {' '}
<p className="bt-k">{"WHY NOW"}</p>          {' '}
<p className="wn-fact">{"DRDO has begun sharing TAPAS technology with Indian industry ahead of a tri-services tender for 87 MALE UAVs, estimated at over ₹25,000 crore. The engines those aircraft fly on will need watching."}</p>          {' '}
<a className="src" href="https://raksha-anirveda.com/drdo-opens-tapas-drone-technologies-to-private-industry-ahead-of-%E2%82%B925000-crore-male-uav-tender/" target="_blank" rel="noopener">{"Source · Raksha Anirveda, 6 May 2026"}</a>          {' '}
<h3 className="wn-close" id="wnClose">{"The engine should warn you before it fails."}</h3>          {' '}
<div className="wn-cta"><a className="btn-p" href="#demo">{"Watch the demo"}</a><a className="btn-s" href="#roadmap">{"See the roadmap"}</a></div>          {' '}
</div>        {' '}
</div>      {' '}
</section>
  );
}
