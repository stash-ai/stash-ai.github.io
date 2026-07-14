/* JEEnius brand — "Knowledge field" WebGL hero.
   A slow 3D particle constellation in brand green + gold: additive glow +
   bloom in dark ("night study"), elegant jewel particles on cream in light.
   Progressive enhancement: reduced-motion or no-WebGL keeps the CSS aurora. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const host = document.querySelector('[data-field]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (host && !reduce) {
  try { boot(host); } catch (e) { /* leave CSS aurora as the fallback */ }
}

function boot(host) {
  const canvas = document.createElement('canvas');
  canvas.className = 'field-canvas';
  host.appendChild(canvas);

  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return; // keep CSS aurora

  const root = document.documentElement;
  const isDark = () => root.classList.contains('dark');

  const smallScreen = window.innerWidth < 720;
  let width = host.clientWidth, height = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !smallScreen, alpha: true, powerPreference: 'high-performance' });
  const DPR = Math.min(devicePixelRatio || 1, smallScreen ? 1.3 : 1.6);
  renderer.setPixelRatio(DPR);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0); // transparent → hero background shows through

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(0, 0, 16);

  // ── particles ──────────────────────────────────────────────────────────
  const GREENS = [0x2e7d5b, 0x3ddc97, 0x7fd8be, 0xdcefd8];
  const GOLD = 0xffd700;
  const N = window.innerWidth < 720 ? 1500 : 2800;
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const sizes = new Float32Array(N);
  const phases = new Float32Array(N);
  const nodes = [];
  const c = new THREE.Color();

  for (let i = 0; i < N; i++) {
    const r = Math.pow(Math.random(), 0.7) * 11 + 1.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.68;
    const z = r * Math.cos(phi);
    positions.set([x, y, z], i * 3);
    c.set(Math.random() > 0.9 ? GOLD : GREENS[(Math.random() * 4) | 0]);
    colors.set([c.r, c.g, c.b], i * 3);
    const bright = Math.random() > 0.955;
    sizes[i] = bright ? 17 + Math.random() * 11 : 3.5 + Math.random() * 7;
    phases[i] = Math.random() * Math.PI * 2;
    if (bright && nodes.length < 60) nodes.push([x, y, z]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

  const uniforms = { uTime: { value: 0 }, uPix: { value: DPR }, uAlpha: { value: 1 }, uGlow: { value: 1 } };
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, vertexColors: true,
    blending: THREE.AdditiveBlending, uniforms,
    vertexShader: `
      attribute float aSize; attribute float aPhase; varying vec3 vColor; varying float vTw;
      uniform float uTime; uniform float uPix;
      void main(){
        vColor = color;
        float tw = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase);
        vTw = tw;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uPix * (1.0 / -mv.z) * 3.4 * tw;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vColor; varying float vTw;
      uniform float uAlpha; uniform float uGlow;
      void main(){
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * (0.82 + vTw * 0.38 * uGlow), a * uAlpha * 0.8);
      }`
  });

  const group = new THREE.Group();
  const points = new THREE.Points(geo, mat);
  group.add(points);

  // constellation lines between near bright nodes
  const linePos = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a[0]-b[0], dy = a[1]-b[1], dz = a[2]-b[2];
      if (dx*dx + dy*dy + dz*dz < 9) linePos.push(a[0],a[1],a[2], b[0],b[1],b[2]);
    }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x7fd8be, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  group.add(new THREE.LineSegments(lineGeo, lineMat));
  scene.add(group);

  // ── bloom (dark only; skip on light where additive washes out) ───────────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.5, 0.6, 0.25);
  composer.addPass(bloom);

  let useBloom = true;
  function applyTheme() {
    const dark = isDark();
    // EffectComposer outputs opaque black — only use it on the dark cosmos, and
    // skip its cost on small screens (mid-range phones); additive still glows
    useBloom = dark && !smallScreen;
    scene.fog = new THREE.FogExp2(dark ? 0x0a1714 : 0xf6f4ef, dark ? 0.05 : 0.08);
    // dark: clear to brand near-black-green (bloom composites on it). light: transparent so cream shows through
    renderer.setClearColor(dark ? 0x0a1714 : 0x000000, dark ? 1 : 0);
    mat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    mat.needsUpdate = true;
    uniforms.uGlow.value = dark ? 1 : 0;
    lineMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    lineMat.opacity = dark ? 0.14 : 0.16;
    lineMat.color.set(dark ? 0x7fd8be : 0x2e7d5b);
    lineMat.needsUpdate = true;
    render();
  }
  function render() { if (useBloom) composer.render(); else renderer.render(scene, camera); }
  applyTheme();
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ['class'] });

  // ── interaction + scroll ────────────────────────────────────────────────
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', (e) => {
    tmx = (e.clientX / innerWidth - 0.5);
    tmy = (e.clientY / innerHeight - 0.5);
  }, { passive: true });

  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    render(); // repaint immediately so a resize pause never shows a stale frame
  }
  addEventListener('resize', resize, { passive: true });

  // pause when the hero scrolls out of view
  let visible = true;
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; })
    .observe(host);

  const clock = new THREE.Clock();
  let raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    // hero scroll progress (0 at top → 1 when scrolled one hero past)
    const rect = host.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));

    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    group.rotation.y = t * 0.04 + mx * 0.5;
    group.rotation.x = my * 0.28 + p * 0.15;
    camera.position.x += (mx * 2.2 - camera.position.x) * 0.04;
    camera.position.y += (-my * 1.5 - camera.position.y) * 0.04;
    camera.position.z = 16 - p * 9;          // dolly through the field on scroll
    uniforms.uAlpha.value = 1 - p * 0.85;    // fade the field as it scrolls away
    camera.lookAt(0, 0, 0);
    render();
  }
  frame();

  // signal CSS that WebGL took over (hide the CSS aurora blobs)
  root.classList.add('webgl');
}
