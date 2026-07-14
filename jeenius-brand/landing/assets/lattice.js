/* JEEnius brand — immersive crystal lattice (JEE / engineering beat).
   A ball-and-stick cubic lattice that tumbles and ASSEMBLES corner-to-corner
   as you scroll through its (tall) section — the geometric, engineered
   counterpart to the organic NEET DNA helix. Scroll drives everything.
   Reduced-motion / no-WebGL falls back to the static CSS gradient. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const host = document.querySelector('[data-lattice]');
const section = document.querySelector('[data-lattice-section]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (host && section && !reduce) {
  try { boot(host, section); } catch (e) { /* CSS fallback stays */ }
}

function boot(host, section) {
  const canvas = document.createElement('canvas');
  canvas.className = 'lattice-canvas';
  host.appendChild(canvas);
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return;

  const root = document.documentElement;
  const isDark = () => root.classList.contains('dark');
  const small = window.innerWidth < 720;

  let width = host.clientWidth, height = host.clientHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.3 : 1.6));
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.set(0, 0, 13);

  const GREEN = 0x2e7d5b, MINT = 0x7fd8be, LIME = 0x3ddc97, GOLD = 0xffd700;
  const N = small ? 3 : 3, S = 3.4, off = (N - 1) / 2;

  const lattice = new THREE.Group();
  scene.add(lattice);

  // thresholds sweep corner-to-corner (x+y+z), normalised 0..1 → drives assembly
  const maxSum = (N - 1) * 3 || 1;
  const parts = []; // { mesh, t, base }

  const sphGeo = new THREE.SphereGeometry(0.32, 14, 14);
  const grid = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) for (let z = 0; z < N; z++) {
    const corner = (x === 0 || x === N - 1) && (y === 0 || y === N - 1) && (z === 0 || z === N - 1);
    const col = corner ? GOLD : ((x + y + z) % 2 ? MINT : LIME);
    const m = new THREE.Mesh(sphGeo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: corner ? 0.65 : 0.5, roughness: 0.3, metalness: 0.2 }));
    m.position.set((x - off) * S, (y - off) * S, (z - off) * S);
    lattice.add(m);
    parts.push({ mesh: m, t: (x + y + z) / maxSum, base: corner ? 0.65 : 0.5 });
    grid.push({ x, y, z, node: m });
  }

  const up = new THREE.Vector3(0, 1, 0);
  const bondGeo = new THREE.CylinderGeometry(0.055, 0.055, 1, 6);
  for (let i = 0; i < grid.length; i++) for (let j = i + 1; j < grid.length; j++) {
    const a = grid[i], b = grid[j];
    if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z) !== 1) continue;
    const mesh = new THREE.Mesh(bondGeo, new THREE.MeshStandardMaterial({ color: GREEN, emissive: MINT, emissiveIntensity: 0.28, roughness: 0.4 }));
    const dir = b.node.position.clone().sub(a.node.position), len = dir.length();
    mesh.scale.set(1, len, 1);
    mesh.position.copy(a.node.position).add(dir.clone().multiplyScalar(0.5));
    mesh.quaternion.setFromUnitVectors(up, dir.clone().normalize());
    lattice.add(mesh);
    const mt = ((a.x + b.x) / 2 + (a.y + b.y) / 2 + (a.z + b.z) / 2) / maxSum;
    parts.push({ mesh: mesh, t: mt, base: 0.28, len: len });
  }

  scene.add(new THREE.AmbientLight(0x88bbb0, 0.55));
  const key = new THREE.PointLight(0xbfe7d6, 1.15, 60); key.position.set(9, 10, 12); scene.add(key);
  const rim = new THREE.PointLight(GOLD, 0.4, 40); rim.position.set(-8, -6, 8); scene.add(rim);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.75, 0.7, 0.12);
  composer.addPass(bloom);

  let useBloom = true;
  function applyTheme() {
    const dark = isDark();
    useBloom = dark && !small;
    // dark backdrop matches the CSS .imx-sticky bg + DNA section (#07201d) so the
    // lattice and DNA sections share one uniform background (no split / seam)
    scene.fog = new THREE.FogExp2(dark ? 0x07201d : 0xf6f4ef, dark ? 0.045 : 0.06);
    renderer.setClearColor(dark ? 0x07201d : 0x000000, dark ? 1 : 0);
    rim.intensity = dark ? 0.4 : 0.28;
    render();
  }
  function render() { if (useBloom) composer.render(); else renderer.render(scene, camera); }

  applyTheme();
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ['class'] });

  const beats = Array.prototype.slice.call(document.querySelectorAll('[data-lattice-beat]'));
  const valueEl = document.querySelector('[data-lattice-value]');
  const leadEl = valueEl && valueEl.querySelector('.imx-vlead');
  const textEl = valueEl && valueEl.querySelector('.imx-vtext');
  let lastActive = -1;

  // mobile has no scroll-scrub room → don't cycle subjects; show them all
  // selected with one general value line
  const cycle = window.matchMedia('(min-width: 900px)').matches;
  if (!cycle && beats.length) {
    beats.forEach(function (b) { b.classList.add('on'); });
    if (leadEl && valueEl.dataset.leadAll) { leadEl.textContent = valueEl.dataset.leadAll; textEl.textContent = valueEl.dataset.textAll; }
  }

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  addEventListener('pointermove', function (e) { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5; }, { passive: true });

  function resize() {
    width = host.clientWidth; height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false); composer.setSize(width, height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    render();
  }
  addEventListener('resize', resize, { passive: true });

  let visible = true;
  new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { rootMargin: '10% 0px' }).observe(section);

  const clock = new THREE.Clock();
  const smooth = function (a, b, x) { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();

    const rect = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight || 1)));

    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    lattice.rotation.y = t * 0.12 + p * Math.PI * 1.6 + mx * 0.6;
    lattice.rotation.x = 0.3 + Math.sin(t * 0.2) * 0.12 + my * 0.3;
    camera.position.x += (mx * 1.8 - camera.position.x) * 0.05;
    camera.position.y += (-my * 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // full crystal, always present; a bright "solve" wave sweeps corner-to-corner
    // with scroll, lighting up nodes and bonds as it passes (no fragile scaling)
    const sweep = p * 1.15;
    for (let i = 0; i < parts.length; i++) {
      const pr = parts[i];
      pr.mesh.material.emissiveIntensity = pr.base + smooth(0.13, 0, Math.abs(pr.t - sweep)) * 0.9;
    }

    if (cycle && beats.length) {
      const active = Math.min(beats.length - 1, Math.floor(p * beats.length + 0.0001));
      if (active !== lastActive) {
        lastActive = active;
        for (let b = 0; b < beats.length; b++) beats[b].classList.toggle('on', b === active);
        if (leadEl) {
          leadEl.textContent = beats[active].dataset.vlead || '';
          textEl.textContent = beats[active].dataset.vtext || '';
          valueEl.classList.remove('change'); void valueEl.offsetWidth; valueEl.classList.add('change');
        }
      }
    }

    render();
  }
  frame();

  root.classList.add('lattice-live');
}
