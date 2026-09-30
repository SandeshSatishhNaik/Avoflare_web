// Converted from demos/home.html; behaviour lives in src/site.js.
export default function Demo() {
  return (
    <section className="demo" id="demo" data-t="5600" aria-labelledby="h-demo">      {' '}
<div className="wrap">        {' '}
<div className="demo-head">          {' '}
<div><p className="bt-eyebrow rv">{"05 · DEMO"}</p><h2 id="h-demo" className="rv">{"Watch it "}<em>{"fly."}</em></h2></div>          {' '}
<p className="rv" style={{"--i": "1"}}>{"The full loop, from mission set-up to the engineer's decision."}</p>          {' '}
</div>        {' '}
<div className="demo-grid rv" style={{"--i": "2"}}>          {' '}
<div className="dp" id="dp" tabIndex="0" aria-label="Demo video player. Space to play or pause, arrow keys to skip, F for full screen.">            {' '}
<video id="dpVideo" playsInline muted preload="metadata" poster="/media/v/demo-placeholder.webp" />            {' '}
<span className="dp-tag"><i />{"PLACEHOLDER · THE RECORDED DEMO REPLACES THIS VIDEO"}</span>            {' '}
<button type="button" className="dp-big" id="dpBig" aria-label="Play the demo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg></button>            {' '}
<p className="dp-chap" id="dpChap" aria-hidden="true" />            {' '}
<div className="dp-bar">              {' '}
<button type="button" className="dp-btn" id="dpPlay" aria-label="Play"><svg viewBox="0 0 24 24" aria-hidden="true"><path className="i-play" d="M8 5.5v13l11-6.5z" /><g className="i-pause"><rect x="6.5" y="5" width="4" height="14" rx="1" /><rect x="13.5" y="5" width="4" height="14" rx="1" /></g></svg></button>              {' '}
<span className="dp-time" id="dpTime">{"0:00 / 0:46"}</span>              {' '}
<div className="dp-track" id="dpTrack" role="slider" tabIndex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="46" aria-valuenow="0">                {' '}
<i className="dp-buf" /><i className="dp-fill" id="dpFill" /><span className="dp-ticks" id="dpTicks" /><span className="dp-hover" id="dpHover" />                {' '}
</div>              {' '}
<button type="button" className="dp-btn" id="dpMute" aria-label="Unmute" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" fill="currentColor" stroke="none" /><path className="i-on" d="M15.5 9.5a3.5 3.5 0 0 1 0 5M18 7a7 7 0 0 1 0 10" /><path className="i-off" d="M16 9.5l5 5M21 9.5l-5 5" /></svg></button>              {' '}
<button type="button" className="dp-btn" id="dpFull" aria-label="Full screen"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></button>              {' '}
</div>            {' '}
</div>          {' '}
<div className="dp-side">            {' '}
<p className="dp-k">{"CHAPTERS"}</p>            {' '}
<ol className="dp-list" id="dpList"><li style={{"--n": "0"}}><button type="button" data-t="0"><span className="cn">{"01"}</span><span className="ct">{"Mission set-up"}</span><span className="cm">{"0:00"}</span><i className="cf" aria-hidden="true" /></button></li><li style={{"--n": "1"}}><button type="button" data-t="8.65"><span className="cn">{"02"}</span><span className="ct">{"Take-off and live telemetry"}</span><span className="cm">{"0:08"}</span><i className="cf" aria-hidden="true" /></button></li><li style={{"--n": "2"}}><button type="button" data-t="13.3"><span className="cn">{"03"}</span><span className="ct">{"A fault begins"}</span><span className="cm">{"0:13"}</span><i className="cf" aria-hidden="true" /></button></li><li style={{"--n": "3"}}><button type="button" data-t="19.45"><span className="cn">{"04"}</span><span className="ct">{"The link drops, the aircraft keeps deciding"}</span><span className="cm">{"0:19"}</span><i className="cf" aria-hidden="true" /></button></li><li style={{"--n": "4"}}><button type="button" data-t="28.05"><span className="cn">{"05"}</span><span className="ct">{"The ground station explains it"}</span><span className="cm">{"0:28"}</span><i className="cf" aria-hidden="true" /></button></li><li style={{"--n": "5"}}><button type="button" data-t="36.7"><span className="cn">{"06"}</span><span className="ct">{"The engineer decides"}</span><span className="cm">{"0:36"}</span><i className="cf" aria-hidden="true" /></button></li></ol>            {' '}
<p className="dp-note">{"Chapter titles describe the recorded demo. The footage shown now is a placeholder cut from the site's own clips."}</p>            {' '}
</div>          {' '}
</div>        {' '}
</div>      {' '}
</section>
  );
}
