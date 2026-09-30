// Converted from demos/home.html; behaviour lives in src/site.js.
export default function HeroProblem() {
  return (
    <div className="stack">      {' '}
<section className="hero" id="hero" aria-labelledby="h1">        {' '}
<div className="hero-media" id="heroMedia"><video id="heroVideo" autoPlay muted loop playsInline preload="auto" poster="/media/v/reel-clouds-hd.webp" aria-hidden="true">            {' '}
<source src="/media/v/reel-clouds-hd-720.mp4" type="video/mp4" media="(max-width: 820px)" />            {' '}
<source src="/media/v/reel-clouds-hd.mp4" type="video/mp4" />            {' '}
</video></div>        {' '}
<div className="hero-shade" aria-hidden="true" />        {' '}
<div className="hero-dim" id="heroDim" aria-hidden="true" />        {' '}
<i className="sensor" id="sensor" aria-hidden="true" />        {' '}
<svg className="trace" id="trace" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path id="tracePath" d="" /><circle id="traceDot" r="3.2" cx="-10" cy="-10" /></svg>        {' '}
<aside className="chip" id="chip" aria-label="Live twin reading, simulated replay">          {' '}
<div className="chip-top"><span>{"LIVE TWIN · EGT"}</span><b id="chipState">{"MATCHES"}</b></div>          {' '}
<div className="chip-val"><strong className="num" id="chipVal">{"+0.0"}</strong><span>{"°C vs healthy twin"}</span></div>          {' '}
<svg className="chip-spark" id="chipSpark" viewBox="0 0 220 30" preserveAspectRatio="none" aria-hidden="true" />          {' '}
<div className="chip-row"><span>{"T+"}<span className="num" id="chipT">{"00:00"}</span></span><span className="num" id="chipAlt">{"0 m"}</span><span>{"simulated"}</span></div>          {' '}
</aside>        {' '}
<div className="wrap hero-inner">          {' '}
<h1 id="h1"><span className="line">{"Intelligence in"}</span><span className="line"><em>{"Every Flight."}</em></span></h1>          {' '}
<div className="hero-aside">            {' '}
<p className="sub" id="heroSub">{"A digital twin rides along with the UAV's piston engines, catches a fault on board before it grows, and keeps judging even when the link to the ground is lost."}</p>            {' '}
<div className="btns" id="heroBtns">              {' '}
<a className="btn btn-light" href="#problem">{"Begin the climb "}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></a>              {' '}
<a className="btn btn-line" href="#how">{"See how it works"}</a>              {' '}
</div>            {' '}
<p className="meta" id="heroMeta"><span>{"Problem Statement 26054"}</span><span>{"Simulated data · TAPAS V4"}</span><span>{"Imagery: AI-generated"}</span></p>            {' '}
</div>          {' '}
</div>        {' '}
<div className="cue" aria-hidden="true" id="heroCue">{"SCROLL TO CLIMB"}<i /></div>        {' '}
</section>      {' '}
<section className="sheet problem" id="problem" data-t="0" aria-labelledby="h-problem">        {' '}
<div className="pb-media" aria-hidden="true"><div className="pb-bg" /><div className="veil" /></div>        {' '}
<div className="wrap pb" style={{"paddingTop": "clamp(104px, 15vh, 144px)"}}>          {' '}
<div className="pb-open">            {' '}
<h2 id="h-problem" className="rv">{"Most monitors speak up "}<em>{"after the fault begins."}</em></h2>            {' '}
<div className="pb-copy">              {' '}
<p className="rv" style={{"--i": "1"}}>{"Problem Statement 26054 asks for a "}<strong>{"real-time digital twin"}</strong>{" of the piston engines in a MALE UAV, one that sees trouble coming."}</p>              {' '}
<p className="rv pb-sub" style={{"--i": "2"}}>{"What changes, and how far AVOFLARE has come on each requirement."}</p>              {' '}
</div>            {' '}
</div>          {' '}
<div className="pb-grid">            {' '}
<div className="shift rv" role="table" aria-label="Today compared with what the statement asks for">              {' '}
<div className="shift-head" role="row"><span role="columnheader">{"Today"}</span><span aria-hidden="true" /><span role="columnheader">{"Asked for"}</span></div>              {' '}
<div className="shift-row" role="row" style={{"--r": "0"}}><p className="was" role="cell">{"Alarm after the fault"}</p><i aria-hidden="true" /><p className="will" role="cell">{"Warning before it"}</p></div>              {' '}
<div className="shift-row" role="row" style={{"--r": "1"}}><p className="was" role="cell">{"Fixed limits"}</p><i aria-hidden="true" /><p className="will" role="cell">{"A live virtual engine"}</p></div>              {' '}
<div className="shift-row" role="row" style={{"--r": "2"}}><p className="was" role="cell">{"No view of wear"}</p><i aria-hidden="true" /><p className="will" role="cell">{"Remaining life, predicted"}</p></div>              {' '}
</div>            {' '}
<div className="ledger rv" style={{"--i": "1"}}>              {' '}
<div className="ledger-head">                {' '}
<h3>{"Requirements A–F"}</h3>                {' '}
<ul className="tally" aria-label="1 built, 4 partly built, 1 designed"><li><i className="mark built" aria-hidden="true" /><b>{"1"}</b>{" built"}</li><li><i className="mark partly" aria-hidden="true" /><b>{"4"}</b>{" partly"}</li><li><i className="mark designed" aria-hidden="true" /><b>{"1"}</b>{" designed"}</li></ul>                {' '}
</div>              {' '}
<ol className="rows" aria-label="Requirements A to F"><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"A"}</span><h4><span className="sr">{"Requirement A: "}</span>{"Digital twin core"}</h4><small>{"Engine model and healthy run"}</small><span className="state"><i className="mark partly" aria-hidden="true" />{"Partly built"}</span></a></li><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"B"}</span><h4><span className="sr">{"Requirement B: "}</span>{"Health monitoring"}</h4><small>{"6 of 8 parameters on CAN"}</small><span className="state"><i className="mark partly" aria-hidden="true" />{"Partly built"}</span></a></li><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"C"}</span><h4><span className="sr">{"Requirement C: "}</span>{"Fault detection"}</h4><small>{"52 fault types simulated"}</small><span className="state"><i className="mark partly" aria-hidden="true" />{"Partly built"}</span></a></li><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"D"}</span><h4><span className="sr">{"Requirement D: "}</span>{"AI/ML layer"}</h4><small>{"Edge AI and GCS AI"}</small><span className="state"><i className="mark designed" aria-hidden="true" />{"Designed"}</span></a></li><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"E"}</span><h4><span className="sr">{"Requirement E: "}</span>{"Simulation & replay"}</h4><small>{"10 mission profiles"}</small><span className="state"><i className="mark built" aria-hidden="true" />{"Built"}</span></a></li><li><a className="lrow" href="#problem"><span className="k" aria-hidden="true">{"F"}</span><h4><span className="sr">{"Requirement F: "}</span>{"Dashboard"}</h4><small>{"MATLAB dashboard, web replay"}</small><span className="state"><i className="mark partly" aria-hidden="true" />{"Partly built"}</span></a></li></ol>              {' '}
</div>            {' '}
</div>          {' '}
<div className="pb-end rv">            {' '}
<a className="btn btn-deep" href="#problem">{"Open the requirement map "}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>            {' '}
<span>{"Simulated data · status from the repository audit"}</span>            {' '}
</div>          {' '}
</div>        {' '}
</section>      {' '}
</div>
  );
}
