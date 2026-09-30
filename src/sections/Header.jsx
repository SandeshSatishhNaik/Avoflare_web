// Converted from demos/home.html; behaviour lives in src/site.js.
export default function Header() {
  return (
    <header className="hdr nav clear" id="hdr" role="banner">      {' '}
<a className="brand" href="#top" aria-label="AVOFLARE, back to top"><img src="/brand/mark-128.png" alt="" width="28" height="28" /><b>{"AVOFLARE"}</b></a>      {' '}
<div className="hdr-now" aria-live="polite"><span className="roll"><span id="nowText">{"Intelligence in every flight"}</span></span><i className="line" aria-hidden="true" /></div>      {' '}
<button className="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="menu">{"Menu "}<span className="burger" aria-hidden="true" /></button>      {' '}
</header>
  );
}
