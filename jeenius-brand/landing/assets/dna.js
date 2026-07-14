/* JEEnius brand — immersive DNA helix (NEET / life-sciences beat).
   A 3D double helix that rotates and travels as you scroll through its
   (tall) section, base pairs lighting up along a moving scan line. The scroll
   position drives everything, so the motion "connects" to the reader's scroll.
   Progressive enhancement: reduced-motion or no-WebGL shows the static CSS
   fallback in the section; pauses when off-screen. */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const host = document.querySelector('[data-dna]');
const section = document.querySelector('[data-dna-section]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (host && section && !reduce) {
  try { boot(host, section); } catch (e) { /* CSS fallback stays */ }
}

function boot(host, section) {
  const canvas = document.createElement('canvas');
  canvas.className = 'dna-canvas';
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
  camera.position.set(0, 0, 15);

  const TEAL = 0x14a89d, MINT = 0x7fe6dc, CORAL = 0xe63946, AMBER = 0xf4a259, GOLD = 0xffd700;
  const SEG = small ? 40 : 60, TURNS = 5, R = 3.2, H = 27;

  const helix = new THREE.Group();
  scene.add(helix);

  // backbone curves
  const strandA = [], strandB = [];
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG, a = t * TURNS * Math.PI * 2, y = (t - 0.5) * H;
    strandA.push(new THREE.Vector3(Math.cos(a) * R, y, Math.sin(a) * R));
    strandB.push(new THREE.Vector3(Math.cos(a + Math.PI) * R, y, Math.sin(a + Math.PI) * R));
  }
  function backbone(pts, color) {
    const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), SEG * 3, 0.15, 9, false);
    return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.45, roughness: 0.35, metalness: 0.2 }));
  }
  helix.add(backbone(strandA, TEAL));
  helix.add(backbone(strandB, MINT));

  // nucleotides + base-pair rungs — keep refs + their position along the helix (0..1)
  const sphGeo = new THREE.SphereGeometry(0.33, 14, 14);
  const rungGeo = new THREE.CylinderGeometry(0.07, 0.07, 1, 6);
  const up = new THREE.Vector3(0, 1, 0);
  const parts = []; // { mesh, t, mat, base }
  function addPart(mesh, t, base) { parts.push({ mesh: mesh, t: t, mat: mesh.material, base: base }); helix.add(mesh); }
  for (let i = 0; i <= SEG; i += 2) {
    const t = i / SEG, A = strandA[i], B = strandB[i];
    [[A, TEAL], [B, MINT]].forEach(function (pc) {
      const m = new THREE.Mesh(sphGeo, new THREE.MeshStandardMaterial({ color: pc[1], emissive: pc[1], emissiveIntensity: 0.5, roughness: 0.3 }));
      m.position.copy(pc[0]); addPart(m, t, 0.5);
    });
    const mid = A.clone().add(B).multiplyScalar(0.5);
    [[A, CORAL], [B, AMBER]].forEach(function (ec) {
      const rung = new THREE.Mesh(rungGeo, new THREE.MeshStandardMaterial({ color: ec[1], emissive: ec[1], emissiveIntensity: 0.4, roughness: 0.4 }));
      const dir = mid.clone().sub(ec[0]), len = dir.length();
      rung.scale.set(1, len, 1);
      rung.position.copy(ec[0]).add(dir.clone().multiplyScalar(0.5));
      rung.quaternion.setFromUnitVectors(up, dir.clone().normalize());
      addPart(rung, t, 0.4);
    });
  }

  // lights (key travels with the scan line)
  scene.add(new THREE.AmbientLight(0x88bbb0, 0.55));
  const key = new THREE.PointLight(0x9ff0e4, 1.2, 60); key.position.set(7, 8, 12); scene.add(key);
  const rim = new THREE.PointLight(CORAL, 0.5, 50); rim.position.set(-10, -6, 6); scene.add(rim);
  const scan = new THREE.PointLight(GOLD, 0, 14); scene.add(scan);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.7, 0.7, 0.12);
  composer.addPass(bloom);

  let useBloom = true;
  function applyTheme() {
    const dark = isDark();
    useBloom = dark && !small;
    scene.fog = new THREE.FogExp2(dark ? 0x07201d : 0xf6f4ef, dark ? 0.028 : 0.04);
    renderer.setClearColor(dark ? 0x07201d : 0x000000, dark ? 1 : 0);
    rim.intensity = dark ? 0.5 : 0.35;
    render();
  }
  function render() { if (useBloom) composer.render(); else renderer.render(scene, camera); }

  applyTheme();
  new MutationObserver(applyTheme).observe(root, { attributes: true, attributeFilter: ['class'] });

  // subject beats highlight in sync with scroll
  const beats = Array.prototype.slice.call(document.querySelectorAll('[data-dna-beat]'));

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

    // scroll progress through the section (0 as it enters, 1 as it leaves)
    const rect = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / (rect.height - window.innerHeight || 1)));

    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    helix.rotation.y = t * 0.12 + p * TURNS * Math.PI + mx * 0.5;
    helix.rotation.z = mx * 0.12;
    helix.position.y = (p - 0.5) * H * 0.9;      // travel down the strand as you scroll
    camera.position.x += (mx * 2 - camera.position.x) * 0.05;
    camera.position.y += (-my * 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // scan line: base pairs near the centre light up as they pass; travels with p
    const scanT = p;                              // 0..1 along the helix
    scan.position.set(0, (0.5 - scanT) * 0 /*keep centred*/, 6);
    scan.intensity = 1.4;
    for (let i = 0; i < parts.length; i++) {
      const pr = parts[i];
      const d = Math.abs(pr.t - scanT);
      pr.mat.emissiveIntensity = pr.base + smooth(0.14, 0, d) * 1.5; // brighten near the scan line
    }

    if (beats.length) {
      const active = Math.min(beats.length - 1, Math.floor(p * beats.length + 0.0001));
      for (let b = 0; b < beats.length; b++) beats[b].classList.toggle('on', b === active);
    }

    render();
  }
  frame();

  root.classList.add('dna-live'); // CSS hides the static fallback
}
