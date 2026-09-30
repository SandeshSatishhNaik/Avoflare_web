// Wireframe TAPAS-class UAV (TAPAS-BH-201 proportions, photo-fitted). Shared by the demos.
// buildTapas(THREE) -> { lineGeo, fillGeo, LINE_COUNT, X, ENG, GROUND, V, makeProps(material) }
export function buildTapas(THREE) {
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  
  // ---------- geometry accumulators: one line set (drawn in order) and one clay fill
  const L = [], F = [], FI = [];
  const seg = (a, b) => L.push(a.x, a.y, a.z, b.x, b.y, b.z);
  function surface(grid, { closed = true, every = 1, ribEvery = 1 } = {}) {
    // grid[v][u]: v = stations along the part, u = points around a section
    const base = F.length / 3, nu = grid[0].length;
    grid.forEach(row => row.forEach(p => F.push(p.x, p.y, p.z)));
    const uMax = closed ? nu : nu - 1;
    for (let v = 0; v < grid.length - 1; v++) for (let u = 0; u < uMax; u++) {
      const a = base + v * nu + u, b = base + v * nu + (u + 1) % nu, c = a + nu, d = b + nu;
      FI.push(a, c, b, b, c, d);
    }
    grid.forEach((row, v) => { if (v % ribEvery && v !== grid.length - 1) return; for (let u = 0; u < uMax; u++) seg(row[u], row[(u + 1) % nu]); });
    for (let u = 0; u < nu; u += every) for (let v = 0; v < grid.length - 1; v++) seg(grid[v][u], grid[v + 1][u]);
  }
  // body of revolution along x: stations [x, r, cy, sy]
  function loftX(st, n, { cz = 0, sy = 1.05, every = 1 } = {}) {
    surface(st.map(([x, r, cy = 0]) => Array.from({ length: n }, (_, k) => { const t = k / n * Math.PI * 2; return V(x, cy + Math.cos(t) * r * sy, cz + Math.sin(t) * r); })), { every });
  }
  // symmetric airfoil loop, LE at 0, TE at 1
  const foil = (m, th) => {
    const yt = x => 5 * th * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
    const xs = Array.from({ length: m }, (_, i) => (1 - Math.cos(Math.PI * i / (m - 1))) / 2);
    return [...xs.slice().reverse().map(x => [x, yt(x)]), ...xs.slice(1, -1).map(x => [x, -yt(x)])];
  };
  // lifting surface: sections [s, le, chord, off], place(xc, yc, s, off) -> Vector3
  function lifting(sections, th, place, every = 3) {
    const f = foil(12, th);
    surface(sections.map(([s, le, ch, off]) => f.map(([xc, yc]) => place(le - xc * ch, yc * ch, s, off))), { every });
  }
  function circle(c, r, axis, n = 24) {
    const pts = Array.from({ length: n }, (_, k) => { const t = k / n * Math.PI * 2, a = Math.cos(t) * r, b = Math.sin(t) * r;
      return axis === 'z' ? V(c.x + a, c.y + b, c.z) : V(c.x, c.y + a, c.z + b); });
    pts.forEach((p, k) => seg(p, pts[(k + 1) % n]));
    return pts;
  }
  function wheel(c, r, w) {
    const a = circle(V(c.x, c.y, c.z - w), r, 'z'), b = circle(V(c.x, c.y, c.z + w), r, 'z'), h = circle(V(c.x, c.y, c.z - w), r * .45, 'z');
    a.forEach((p, k) => { if (k % 3 === 0) seg(p, b[k]); });
    circle(V(c.x, c.y, c.z + w), r * .45, 'z');
  }
  
  // ---------- the aircraft (metres, x forward, y up, z to starboard)
  // Measured from public TAPAS-BH-201 imagery (side-view drawing + flight photo), scaled to the published 9.5 m length
  // and 20.6 m span. Stations are given as distance d from the nose; x = NOSE - d.
  const NOSE = 4.75, X = d => NOSE - d;
  // Catmull-Rom densify a station table so the skin is smooth; ribs are drawn only on the measured stations.
  function densify(st, k) {
    const out = [];
    for (let i = 0; i < st.length - 1; i++) for (let j = 0; j < k; j++) {
      const t = j / k, p0 = st[Math.max(0, i - 1)], p1 = st[i], p2 = st[i + 1], p3 = st[Math.min(st.length - 1, i + 2)];
      out.push(p1.map((_, c) => { const a0 = p0[c], a1 = p1[c], a2 = p2[c], a3 = p3[c];
        return .5 * ((2 * a1) + (-a0 + a2) * t + (2 * a0 - 5 * a1 + 4 * a2 - a3) * t * t + (-a0 + 3 * a1 - 3 * a2 + a3) * t * t * t); }));
    }
    out.push(st.at(-1)); return out;
  }
  // Superellipse body: stations [d, top, bottom, halfWidth]; exponent > 2 gives the flat-sided, rounded-box section.
  function body(st, n, e, { every = 2, cz = 0, k = 3 } = {}) {
    const sp = (c, q) => Math.sign(c) * Math.pow(Math.abs(c), 2 / q);
    surface(densify(st, k).map(([d, top, bot, hw]) => { const cy = (top + bot) / 2, ry = (top - bot) / 2;
      return Array.from({ length: n }, (_, j) => { const t = j / n * Math.PI * 2; return V(X(d), cy + sp(Math.cos(t), e) * ry, cz + sp(Math.sin(t), e) * hw); }); }), { every, ribEvery: k });
  }
  // fuselage: blunt round nose, tall flat-topped satcom hump that ends at the wing, half-depth tail boom, blunt tail cone
  body([
    [0, .0, -.03, .02], [.07, .15, -.16, .19], [.16, .26, -.21, .29], [.3, .4, -.27, .36], [.48, .52, -.31, .42],
    [.86, .64, -.35, .48], [1.31, .69, -.37, .5], [2.39, .72, -.38, .52], [3.34, .7, -.4, .52], [4.3, .66, -.42, .51],
    [4.9, .6, -.43, .48], [5.45, .5, -.44, .44], [6.0, .41, -.43, .38], [6.6, .34, -.4, .33], [7.3, .29, -.34, .27],
    [7.9, .26, -.27, .23], [8.5, .25, -.12, .18], [8.98, .24, -.01, .13], [9.32, .22, .06, .1], [9.36, .17, .11, .04],
  ], 40, 2.5, { every: 2, k: 3 });
  // orange nose cap boundary and fuselage panel breaks
  const ring = (d, top, bot, hw, e = 2.5, n = 40) => { const sp = (c, q) => Math.sign(c) * Math.pow(Math.abs(c), 2 / q), cy = (top + bot) / 2, ry = (top - bot) / 2;
    const P = Array.from({ length: n }, (_, j) => { const t = j / n * Math.PI * 2; return V(X(d), cy + sp(Math.cos(t), e) * ry * 1.004, sp(Math.sin(t), e) * hw * 1.004); }); P.forEach((q, j) => seg(q, P[(j + 1) % n])); };
  ring(.42, .49, -.3, .41); ring(1.95, .715, -.375, .515); ring(4.6, .635, -.425, .5);
  // electro-optic turret under the nose, a second sensor fairing behind it, pitot probe
  body([[.8, -.33, -.35, .02], [.86, -.3, -.43, .12], [.97, -.3, -.53, .17], [1.1, -.31, -.52, .15], [1.18, -.33, -.4, .05]], 20, 2, { every: 2, k: 2 });
  body([[1.2, -.3, -.33, .04], [1.45, -.3, -.46, .19], [2.4, -.31, -.5, .23], [3.4, -.33, -.49, .22], [4.1, -.36, -.42, .1], [4.3, -.38, -.4, .02]], 22, 2.6, { every: 2, k: 2 });
  seg(V(X(0), -.015, 0), V(X(-.45), -.015, 0)); seg(V(X(-.45), -.015, 0), V(X(-.42), -.015, .015));
  // blade antennas on the spine and belly
  const blade = (d, y, h, up) => { const s1 = up ? 1 : -1; seg(V(X(d), y, 0), V(X(d + .1), y + s1 * h, 0)); seg(V(X(d + .1), y + s1 * h, 0), V(X(d + .2), y + s1 * h, 0)); seg(V(X(d + .2), y + s1 * h, 0), V(X(d + .28), y, 0)); };
  seg(V(X(3.15), .7, 0), V(X(3.18), 1.18, 0)); seg(V(X(3.2), .7, .02), V(X(3.18), 1.18, 0)); blade(4.4, -.42, .14, false); blade(8.1, -.23, .14, false);
  
  // shoulder wing: straight leading edge, taper on the trailing edge, light dihedral, flaps and ailerons
  const WING = s => { const t = s / 10.3; return { le: X(5.3) - t * .06, ch: 1.43 - t * .83, y: .47 + s * .029 }; };
  body([[4.95, .5, .2, .05], [5.25, .6, .2, .4], [5.7, .625, .2, .47], [6.2, .6, .2, .45], [6.7, .52, .2, .37], [7.05, .42, .2, .2], [7.3, .34, .2, .04]], 32, 2.2, { every: 2, k: 3 });
  const spansW = [0, .45, .9, 1.45, 2.1, 3.0, 4.2, 5.4, 6.6, 7.8, 9.0, 9.8, 10.3];
  for (const side of [1, -1]) {
    lifting(spansW.map(s => { const w = WING(s); return [s * side, w.le, w.ch, w.y]; }), .16, (x, y, s, off) => V(x, off + y, s), 3);
    // control surfaces: flap from nacelle to mid span, aileron outboard; hinge line on the upper skin at 74 % chord
    const hinge = (s0, s1) => { const pt = s => { const w = WING(s); return V(w.le - .74 * w.ch, w.y + .018, s * side); };
      seg(pt(s0), pt(s1)); for (const q of [s0, s1]) { const w = WING(q); seg(pt(q), V(w.le - w.ch, w.y, q * side)); } };
    hinge(2.2, 5.9); hinge(6.0, 9.6);
    // tip fairing
    const w = WING(10.3); seg(V(w.le, w.y, 10.3 * side), V(w.le - w.ch, w.y + .01, 10.42 * side)); seg(V(w.le - w.ch, w.y, 10.3 * side), V(w.le - w.ch, w.y + .01, 10.42 * side));
  }
  
  // engine nacelles close to the fuselage: prop well ahead of the wing, deep pod running past the trailing edge
  const ENG = [1.65, -1.65], DS = 4.2 - 2.62, NY = .02, SY = .12; // spinner tip at 4.2 m from the nose
  for (const z of ENG) {
    body([
      [2.82, .3, .26, .02], [2.9, .38, .18, .1], [3.0, .44, .09, .16], [3.15, .44, -.03, .21], [3.5, .52, -.13, .25],
      [4.1, .57, -.17, .26], [4.7, .57, -.15, .25], [5.1, .54, -.08, .2], [5.35, .5, .02, .12], [5.5, .47, .1, .02],
    ].map(([d, t, b, w]) => [d + DS, t + NY, b + NY, w]), 26, 2.4, { cz: z, every: 2, k: 3 });
    // spinner, cooling intake under the nose of the pod, exhaust stub
    body([[2.62, .23, .21, .01], [2.68, .28, .16, .06], [2.78, .31, .13, .09], [2.9, .32, .12, .1]].map(([d, t, b, w]) => [d + DS, t + SY, b + SY, w]), 16, 2, { cz: z, every: 2, k: 2 });
    body([[3.1, -.02, -.04, .02], [3.18, -.03, -.14, .12], [3.45, -.1, -.2, .13], [3.8, -.14, -.18, .1], [3.95, -.15, -.15, .02]].map(([d, t, b, w]) => [d + DS, t + NY, b + NY, w]), 16, 2.6, { cz: z, every: 2, k: 2 });
    body([[4.3, -.08, -.1, .01], [4.34, -.06, -.18, .05], [4.65, -.05, -.17, .05], [4.7, -.07, -.11, .01]].map(([d, t, b, w]) => [d + DS, t + NY, b + NY, w]), 12, 2, { cz: z + Math.sign(z) * .2, every: 2, k: 2 });
  }
  
  // T-tail: fin with a swept leading edge and vertical trailing edge, rudder, stabiliser with elevators on top
  const FIN = [[.03, X(7.1), 2.2], [.1, X(7.45), 1.88], [.2, X(7.68), 1.66], [.7, X(7.98), 1.38], [1.3, X(8.3), 1.06], [1.85, X(8.57), .8]];
  lifting(FIN.map(([h, le, ch]) => [.26 + h - .2, le, ch, 0]), .12, (x, y, s) => V(x, s, y), 3);
  seg(V(X(9.02), .4, .07), V(X(9.02), 2.04, .05)); seg(V(X(9.02), .4, -.07), V(X(9.02), 2.04, -.05));
  const STAB = s => ({ le: X(8.42) - Math.abs(s) * .1, ch: 1.0 - Math.abs(s) * .19, y: 2.06 });
  for (const side of [1, -1]) {
    lifting([.05, .8, 1.6, 2.5].map(s => { const w = STAB(s); return [s * side, w.le, w.ch, w.y]; }), .11, (x, y, s, off) => V(x, off + y, s), 3);
    const h = s => { const w = STAB(s); return V(w.le - .7 * w.ch, w.y + .013, s * side); }; seg(h(.15), h(2.45));
  }
  
  // landing gear: nose leg under the hump, main legs under the nacelles
  const GROUND = -1.38;
  const leg = (d, z, y0, r) => { const top = V(X(d), y0, z), hub = V(X(d) + .05, GROUND + r, z); seg(top, hub); seg(V(X(d) - .18, y0, z), V(X(d) - .02, GROUND + r + .28, z)); wheel(hub, r, r * .32); };
  leg(1.2, 0, -.46, .17);
  for (const z of ENG) leg(4.55, z, -.06, .24);
  
  const LINE_COUNT = L.length / 3;
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(L, 3));
  const fillGeo = new THREE.BufferGeometry();
  fillGeo.setAttribute('position', new THREE.Float32BufferAttribute(F, 3));
  fillGeo.setIndex(FI); fillGeo.computeVertexNormals();
  // propellers: three blades each; returns groups to add and spin
  const makeProps = ink => ENG.map(z => {
    const g = new THREE.Group(); g.position.set(X(4.28), .34, z);
    const P = [];
    for (let b = 0; b < 3; b++) {
      const a = b / 3 * Math.PI * 2, blade = [];
      for (let i = 0; i <= 8; i++) { const r = .1 + i / 8 * .7, w = .085 * Math.sin(Math.PI * (.25 + .7 * i / 8)); blade.push([r, w]); }
      const pt = (r, w) => V(0, Math.cos(a) * r - Math.sin(a) * w, Math.sin(a) * r + Math.cos(a) * w);
      for (let i = 0; i < blade.length - 1; i++) { const [r0, w0] = blade[i], [r1, w1] = blade[i + 1];
        P.push(pt(r0, w0), pt(r1, w1), pt(r0, -w0 * .6), pt(r1, -w1 * .6), pt(r0, 0), pt(r1, 0)); }
      P.push(pt(.8, .02), pt(.8, -.012));
    }
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(P), ink)); return g;
  });
  return { lineGeo, fillGeo, LINE_COUNT, X, ENG, GROUND, V, makeProps };
}
