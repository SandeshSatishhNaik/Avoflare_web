// Converted from demos/home.html; behaviour lives in src/site.js.
export default function WhatsNew() {
  return (
    <section className="wn" id="whatsnew" data-t="4200" aria-labelledby="h-wn">      {' '}
<div className="wrap">        {' '}
<div className="wn-head">          {' '}
<div><p className="bt-eyebrow rv">{"04 · WHAT'S NEW"}</p><h2 id="h-wn" className="rv">{"What's new, "}<em>{"and what comes next."}</em></h2></div>          {' '}
<p className="rv" style={{"--i": "1"}}>{"Three ideas that change how engine health is watched, and two that come next. Each one answers an innovation area in the problem statement."}</p>          {' '}
</div>        {' '}
<div className="wn-grid">          {' '}
<ol className="wn-steps"><li className="wn-step" data-k="0">              {' '}
<p className="wn-meta"><span className="wn-chip d">{"DESIGNED"}</span><span className="n">{"01"}</span></p>              {' '}
<h3>{"Physics and data "}<em>{"check each other."}</em></h3>              {' '}
<p>{"A physics model of the engine predicts what each reading should be. The measured value runs beside it. When the two drift apart and stay apart, the gap itself becomes the early warning."}</p>              {' '}
<p className="wn-area">{"Physics-informed AI · Hybrid thermodynamic and data-driven models"}</p>              {' '}
</li><li className="wn-step" data-k="1">              {' '}
<p className="wn-meta"><span className="wn-chip d">{"DESIGNED"}</span><span className="n">{"02"}</span></p>              {' '}
<h3>{"Every alert "}<em>{"explains itself."}</em></h3>              {' '}
<p>{"An alert never arrives alone. It opens into its reasons: which reading moved, how far from the twin, how many sensors agree, and how sure the system is."}</p>              {' '}
<p className="wn-area">{"Explainable AI for fault diagnosis"}</p>              {' '}
</li><li className="wn-step" data-k="2">              {' '}
<p className="wn-meta"><span className="wn-chip d">{"DESIGNED"}</span><span className="n">{"03"}</span></p>              {' '}
<h3>{"The engineer "}<em>{"decides."}</em></h3>              {' '}
<p>{"The system recommends; a person approves. Nothing reaches the maintenance plan until the engineer says so. Try it on the panel."}</p>              {' '}
<p className="wn-area">{"Autonomous maintenance advisory, with human authority"}</p>              {' '}
</li><li className="wn-step" data-k="3">              {' '}
<p className="wn-meta"><span className="wn-chip p">{"PLANNED"}</span><span className="n">{"04"}</span></p>              {' '}
<h3>{"Coming next: "}<em>{"trusted links, shared learning."}</em></h3>              {' '}
<p>{"Telemetry that is signed on the aircraft and checked on arrival. A fleet that improves one shared model while each aircraft keeps its raw data."}</p>              {' '}
<p className="wn-area">{"Secure telemetry architecture · Federated learning"}</p>              {' '}
</li></ol>          {' '}
<div className="wn-side">            {' '}
<div className="wn-panel" id="wnPanel" data-k="0">              {' '}
<div className="wn-top"><span className="wn-title" id="wnTitle">{"Physics vs measured"}</span><span className="wn-ill">{"ILLUSTRATIVE"}</span></div>              {' '}
<div className="wn-vis v0 on" data-k="0">                {' '}
<svg viewBox="0 0 520 300" className="pvm" id="pvm" aria-label="Illustration: a measured engine reading follows the physics prediction, then drifts outside the allowed band and is flagged"><defs><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="rgba(217,72,43,.08)" /><line x1="0" y1="0" x2="0" y2="6" stroke="rgba(217,72,43,.35)" strokeWidth="2" /></pattern></defs><g className="ax"><line x1="30" y1="270" x2="510" y2="270" /><line x1="30" y1="20" x2="30" y2="270" /><text x="510" y="290" textAnchor="end">{"time"}</text><text x="24" y="16" textAnchor="start">{"engine temperature"}</text></g><path className="pvm-band" id="pvmBand" /><path className="gap" id="pvmGap" /><path className="phys" id="pvmPhys" /><path className="meas draw" id="pvmMeas" pathLength="1" /><g className="flag" id="pvmFlag"><circle r="6" /><g className="fl-chip"><rect x="-166" y="10" width="154" height="28" rx="14" /><text x="-89" y="28.5" textAnchor="middle">{"Gap stays open · flagged"}</text></g></g></svg>                {' '}
<div className="wn-key"><span><i className="k phys" />{"Physics prediction"}</span><span><i className="k meas" />{"Measured"}</span><span><i className="k bnd" />{"Allowed band"}</span></div>                {' '}
</div>              {' '}
<div className="wn-vis v1" data-k="1">                {' '}
<div className="al">                  {' '}
<div className="al-head"><span className="al-dot" /><div><b>{"Cylinder 3 temperature rising"}</b><small>{"Watch · engine 1"}</small></div></div>                  {' '}
<ul className="al-why"><li style={{"--n": "0"}}><i /><span><b>{"Reading"}</b>{"Cylinder-head temperature is running above the twin's prediction."}</span></li><li style={{"--n": "1"}}><i /><span><b>{"Duration"}</b>{"The gap has held for several minutes, not a single spike."}</span></li><li style={{"--n": "2"}}><i /><span><b>{"Agreement"}</b>{"Related sensors move the same way."}</span></li><li style={{"--n": "3"}}><i /><span><b>{"Trend"}</b>{"Still rising."}</span></li></ul>                  {' '}
<div className="al-conf"><span>{"Confidence"}</span><div className="bar"><i /></div><b>{"High"}</b></div>                  {' '}
</div>                {' '}
</div>              {' '}
<div className="wn-vis v2" data-k="2">                {' '}
<div className="rec" id="rec" data-state="wait">                  {' '}
<p className="rec-k">{"RECOMMENDATION"}</p>                  {' '}
<h4>{"Inspect the cylinder 3 injector before the next flight."}</h4>                  {' '}
<p className="rec-why">{"Based on the alert and its reasons."}</p>                  {' '}
<div className="rec-btns"><button type="button" className="ok" data-v="ok">{"Approve"}</button><button type="button" data-v="later">{"Defer"}</button></div>                  {' '}
<p className="rec-state" aria-live="polite"><i /><span id="recText">{"Waiting for the engineer"}</span></p>                  {' '}
<button type="button" className="rec-reset" id="recReset" hidden>{"Reset"}</button>                  {' '}
</div>                {' '}
</div>              {' '}
<div className="wn-vis v3" data-k="3">                {' '}
<div className="pl">                  {' '}
<div className="pl-card">                    {' '}
<svg viewBox="0 0 240 150" aria-label="Illustration: a telemetry packet is signed on the aircraft and verified at the ground station"><text className="lab" x="20" y="136">{"Aircraft"}</text><text className="lab" x="220" y="136" textAnchor="end">{"Ground"}</text><rect className="node" x="14" y="62" width="36" height="36" rx="10" /><rect className="node" x="190" y="62" width="36" height="36" rx="10" /><line className="wire" x1="54" y1="80" x2="186" y2="80" /><g className="pkt"><rect x="-14" y="-10" width="28" height="20" rx="5" /><path className="seal" d="M-5 0 l3.5 3.5 l6.5 -7" /></g><path className="tick" d="M200 80 l6 6 l12 -13" /></svg>                    {' '}
<b>{"Secure telemetry"}</b><span>{"Signed on board, checked on arrival."}</span>                    {' '}
</div>                  {' '}
<div className="pl-card">                    {' '}
<svg viewBox="0 0 240 150" aria-label="Illustration: three aircraft send model updates, not raw data, to one shared model"><circle className="hub" cx="120" cy="40" r="18" /><text className="lab" x="120" y="44" textAnchor="middle">{"model"}</text><g className="ac"><circle cx="40" cy="118" r="11" /><circle cx="120" cy="126" r="11" /><circle cx="200" cy="118" r="11" /></g><line className="up" x1="48" y1="108" x2="108" y2="54" /><line className="up" x1="120" y1="114" x2="120" y2="60" /><line className="up" x1="192" y1="108" x2="132" y2="54" /><circle className="dot d1" r="3.5" /><circle className="dot d2" r="3.5" /><circle className="dot d3" r="3.5" /></svg>                    {' '}
<b>{"Shared learning"}</b><span>{"Updates travel. Raw data stays on each aircraft."}</span>                    {' '}
</div>                  {' '}
</div>                {' '}
</div>              {' '}
<div className="wn-rail" role="list" aria-label="Steps">                {' '}
<button type="button" data-k="0" aria-current="true"><i />{"Physics"}</button><button type="button" data-k="1"><i />{"Explained"}</button><button type="button" data-k="2"><i />{"Engineer"}</button><button type="button" data-k="3"><i />{"Next"}</button>                {' '}
</div>              {' '}
</div>            {' '}
</div>          {' '}
</div>        {' '}
</div>      {' '}
</section>
  );
}
