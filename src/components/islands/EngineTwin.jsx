import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { sampleAt, stateOf, prefersReducedMotion } from './lib.js';
import '../../styles/islands.css';

import { SENSORS } from './sensors.js';
export { SENSORS };

const STATE_COLOR = { ok: '#6fa0da', watch: '#e9c24a', fault: '#f2562b', off: '#3a4d6b' };

function sensorState(id, s) {
  if (!s) return 'ok';
  if (id === 'egt') return stateOf(s.dEgt ?? 0);
  if (id === 'turbo') return s.active ? stateOf(s.dEgt ?? 0) === 'ok' ? 'watch' : stateOf(s.dEgt) : 'ok';
  return 'ok';
}

function Engine({ lineMix, spin, lit, t, interactive }) {
  const gltf = useLoader(GLTFLoader, '/models/engine.glb', l => l.setMeshoptDecoder(MeshoptDecoder));
  const group = useRef();
  const drag = useRef({ on: false, x: 0, rot: 0 });
  const { invalidate, gl } = useThree();
  const reduce = useMemo(prefersReducedMotion, []);

  const { geom, edges } = useMemo(() => {
    let g;
    gltf.scene.traverse(o => { if (o.isMesh && !g) g = o.geometry.clone(); });
    g.computeVertexNormals();
    g.computeBoundingBox();
    const c = new THREE.Vector3(); g.boundingBox.getCenter(c); g.translate(-c.x, -c.y, -c.z);
    return { geom: g, edges: new THREE.EdgesGeometry(g, 34) };
  }, [gltf]);

  const s = sampleAt(t);
  useEffect(() => { invalidate(); }, [lineMix, spin, lit, t, invalidate]);

  useEffect(() => {
    if (!interactive) return;
    const el = gl.domElement;
    const down = e => { drag.current = { on: true, x: e.clientX, rot: drag.current.rot }; el.setPointerCapture(e.pointerId); };
    const move = e => { if (!drag.current.on) return; drag.current.rot += (e.clientX - drag.current.x) * 0.008; drag.current.x = e.clientX; invalidate(); };
    const up = () => { drag.current.on = false; };
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up);
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
  }, [interactive, gl, invalidate]);

  useFrame((_, dt) => {
    if (!group.current) return;
    if (interactive && !reduce && !drag.current.on) drag.current.rot += dt * 0.12;
    group.current.rotation.y = -0.6 + spin * Math.PI * 0.9 + drag.current.rot;
    if (interactive && !reduce) invalidate();
  });

  return (
    <group ref={group} rotation={[0.12, -0.6, 0]}>
      <mesh geometry={geom}>
        <meshStandardMaterial color="#5d7090" metalness={0.6} roughness={0.36} transparent opacity={1 - lineMix * 0.82} depthWrite={lineMix < 0.5} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#9cc0e6" transparent opacity={0.24 + lineMix * 0.66} />
      </lineSegments>
      {SENSORS.map((p, i) => {
        const on = i < lit;
        const st = on ? sensorState(p.id, s) : 'off';
        return (
          <group key={p.id} position={p.pos} renderOrder={10}>
            <mesh>
              <sphereGeometry args={[on ? 0.035 : 0.022, 16, 16]} />
              <meshBasicMaterial color={STATE_COLOR[st]} depthTest={false} toneMapped={false} />
            </mesh>
            {on && (
              <mesh>
                <ringGeometry args={[0.055, 0.066, 32]} />
                <meshBasicMaterial color={STATE_COLOR[st]} transparent opacity={0.6} side={THREE.DoubleSide} depthTest={false} toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

// lineMix 0 = shaded engine, 1 = line drawing. lit = how many sensors are active. t = mission time (s).
export default function EngineTwin({ lineMix = 0, spin = 0, lit = SENSORS.length, t = 0, interactive = false, label = 'Representative engine model with sensor points' }) {
  const wrap = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="twin" ref={wrap}>
      {visible ? (
        <Canvas
          frameloop="demand"
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.35, 3.1], fov: 34 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => { gl.domElement.setAttribute('role', 'img'); gl.domElement.setAttribute('aria-label', label); }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[-3, 4, 3]} intensity={2.8} />
          <directionalLight position={[3, 1, -3]} intensity={3.2} color="#6fa0da" />
          <directionalLight position={[0, -3, 2]} intensity={0.35} color="#f2c9a0" />
          <Suspense fallback={null}>
            <Engine lineMix={lineMix} spin={spin} lit={lit} t={t} interactive={interactive} />
          </Suspense>
        </Canvas>
      ) : <div className="twin-poster" aria-hidden="true" />}
    </div>
  );
}
