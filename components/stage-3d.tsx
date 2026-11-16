"use client";

import { useEffect, useRef } from "react";
import { useMotionPermission } from "./motion-permission";

/**
 * The persistent 3D stage (DESIGN.md, section 5).
 *
 * Mounted once in app/layout.tsx so it persists across every page on the site:
 * a sculpted dark-obsidian core with procedural studio reflections, a smooth
 * volumetric cobalt atmosphere, depth-attenuated wireframe lattices, metallic
 * gyroscope rings, orbiting satellite beacons, circular bokeh signal fields,
 * and a scroll/pointer-reactive spectrum glow that orbits with the visitor.
 *
 * Static-first rules:
 *  - The canvas is decoration. It is aria-hidden, takes no pointer events, and
 *    every page is complete without it. With no JavaScript, or if WebGL is
 *    unavailable, the CSS backdrop on `.stage` is what shows.
 *  - three.js is loaded on demand, so it is never in the critical bundle.
 *  - Motion follows the same permission as the rest of the site. When motion is
 *    paused or the visitor prefers reduced motion, the scene renders one still
 *    frame and does not react to the pointer or to scrolling.
 */

type Controller = { setRunning: (running: boolean) => void };

function createHaloTexture(
  THREE: typeof import("three"),
  stops: Array<[number, string]>,
) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const g = ctx.createRadialGradient(half, half, 0, half, half, half);
    for (const [offset, color] of stops) g.addColorStop(offset, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function createStudioEnv(
  THREE: typeof import("three"),
  renderer: import("three").WebGLRenderer,
) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x04060b);

  // Balanced cobalt and soft ice-blue light cards so obsidian facets reflect
  // rich tonal gradients without blowing out into bright white patches.
  const panels: Array<{
    pos: [number, number, number];
    scale: [number, number, number];
    color: number;
    intensity: number;
  }> = [
    { pos: [-6, 7, 5], scale: [9, 3.5, 1], color: 0x9cc0ff, intensity: 1.85 },
    { pos: [8, 1, 4], scale: [6, 8, 1], color: 0x146bff, intensity: 4.2 },
    { pos: [4, 4, -8], scale: [10, 4, 1], color: 0x669fff, intensity: 2.9 },
    { pos: [-4, -7, 3], scale: [9, 3, 1], color: 0x163878, intensity: 1.7 },
  ];

  const disposableGeos: import("three").BufferGeometry[] = [];
  const disposableMats: import("three").Material[] = [];

  for (const p of panels) {
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(p.color).multiplyScalar(p.intensity),
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...p.pos);
    mesh.scale.set(...p.scale);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
    disposableGeos.push(geo);
    disposableMats.push(mat);
  }

  const target = pmrem.fromScene(envScene, 0.055);
  disposableGeos.forEach((g) => g.dispose());
  disposableMats.forEach((m) => m.dispose());
  pmrem.dispose();
  return target;
}

function createDepthWireMaterial(
  THREE: typeof import("three"),
  colorHex: number,
  nearOpacity: number,
  farOpacity: number,
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uNearOpacity: { value: nearOpacity },
      uFarOpacity: { value: farOpacity },
    },
    vertexShader: `
      varying float vDepth;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uNearOpacity;
      uniform float uFarOpacity;
      varying float vDepth;
      void main() {
        // Front hemisphere (~7.5) stays crisp; rear hemisphere (~13.5) recedes into fog.
        float t = clamp((vDepth - 7.4) / 6.2, 0.0, 1.0);
        float alpha = mix(uNearOpacity, uFarOpacity, t);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });
}

function createBokehPointsMaterial(
  THREE: typeof import("three"),
  pixelRatio: number,
  opacity: number,
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uOpacity: { value: opacity },
      uPulse: { value: 1.0 },
    },
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vDepthAlpha;
      uniform float uPixelRatio;
      uniform float uPulse;
      void main() {
        vColor = aColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float dist = max(-mvPosition.z, 1.0);
        gl_PointSize = clamp(aSize * uPulse * uPixelRatio * (260.0 / dist), 1.5, 26.0);
        vDepthAlpha = clamp(1.2 - (dist - 6.0) / 22.0, 0.18, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDepthAlpha;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
        if (d > 1.0) discard;
        // Soft optical core + exponential bokeh halo; strictly 0 at d=1 (no square edges).
        float core = exp(-d * d * 7.5);
        float halo = pow(1.0 - d, 2.4) * 0.45;
        float alpha = (core + halo) * uOpacity * vDepthAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  });
}

function deduplicatePositions(geometry: import("three").BufferGeometry) {
  const pos = geometry.attributes.position;
  const seen = new Set<string>();
  const unique: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const key = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(x, y, z);
    }
  }
  const out = new Float32Array(unique.length);
  out.set(unique);
  return out;
}

export function Stage3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const allowedRef = useRef(false);
  const { allowed } = useMotionPermission();

  useEffect(() => {
    allowedRef.current = allowed;
    controllerRef.current?.setRunning(allowed);
  }, [allowed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let teardown = () => {};

    void (async () => {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        });
      } catch {
        // No WebGL. The CSS backdrop stays; nothing else depends on the scene.
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x08090b, 0.034);

      const envTarget = createStudioEnv(THREE, renderer);
      scene.environment = envTarget.texture;

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 70);
      camera.position.set(0, 0, 10.6);

      const primaryHaloTex = createHaloTexture(THREE, [
        [0, "rgba(102, 159, 255, 0.44)"],
        [0.25, "rgba(20, 107, 255, 0.26)"],
        [0.58, "rgba(14, 48, 128, 0.08)"],
        [1, "rgba(8, 9, 11, 0)"],
      ]);

      const driftHaloTex = createHaloTexture(THREE, [
        [0, "rgba(166, 203, 255, 0.3)"],
        [0.32, "rgba(20, 107, 255, 0.2)"],
        [0.68, "rgba(14, 42, 110, 0.06)"],
        [1, "rgba(8, 9, 11, 0)"],
      ]);

      const wire = (
        geometry: import("three").BufferGeometry,
        color: number,
        nearOpacity: number,
        farOpacity: number,
        disposeSource = true,
      ) => {
        const lines = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          createDepthWireMaterial(THREE, color, nearOpacity, farOpacity),
        );
        if (disposeSource) geometry.dispose();
        return lines;
      };

      const core = new THREE.Group();

      // Primary volumetric back-halo that breathes and intensifies during scroll.
      const haloMat = new THREE.SpriteMaterial({
        map: primaryHaloTex,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.position.set(0, 0, -1.8);
      halo.scale.set(9.8, 9.8, 1);
      core.add(halo);

      // Secondary scroll-and-time sweeping spectrum glow orbs rendered in WebGL
      // (avoiding per-frame CSS radial-gradient repaints on `.stage`).
      const sweepGlowMat = new THREE.SpriteMaterial({
        map: driftHaloTex,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });
      const sweepGlow = new THREE.Sprite(sweepGlowMat);
      sweepGlow.position.set(-2.5, -1.2, -5.5);
      sweepGlow.scale.set(14.5, 11.5, 1);
      scene.add(sweepGlow);

      const ambientGlowMat = new THREE.SpriteMaterial({
        map: primaryHaloTex,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      });
      const ambientGlow = new THREE.Sprite(ambientGlowMat);
      ambientGlow.position.set(2.8, 1.4, -7.0);
      ambientGlow.scale.set(16.0, 12.0, 1);
      scene.add(ambientGlow);

      // Sculpted dark-obsidian geodesic polyhedron (detail 2 = 320 refined facets).
      const obsidianGeo = new THREE.IcosahedronGeometry(1.36, 2);
      const obsidian = new THREE.Mesh(
        obsidianGeo,
        new THREE.MeshPhysicalMaterial({
          color: 0x090e18,
          metalness: 0.74,
          roughness: 0.24,
          clearcoat: 0.88,
          clearcoatRoughness: 0.12,
          ior: 1.6,
          reflectivity: 0.88,
          envMapIntensity: 1.7,
          flatShading: true,
        }),
      );

      const obsidianEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(obsidianGeo, 8),
        createDepthWireMaterial(THREE, 0x669fff, 0.3, 0.05),
      );

      // Volumetric atmospheric Fresnel shell; shifts tone & pulses on scroll.
      const atmosphereMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uInnerColor: { value: new THREE.Color(0x146bff) },
          uRimColor: { value: new THREE.Color(0x669fff) },
          uIntensity: { value: 0.38 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mvPosition.xyz);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uInnerColor;
          uniform vec3 uRimColor;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float ndotv = clamp(dot(normalize(vNormal), normalize(vViewDir)), 0.0, 1.0);
            float edgeFade = smoothstep(0.0, 0.58, ndotv);
            float glow = edgeFade * pow(1.0 - ndotv * 0.72, 2.2);
            vec3 col = mix(uInnerColor, uRimColor, 1.0 - ndotv);
            gl_FragColor = vec4(col, glow * uIntensity);
          }
        `,
      });
      const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.08, 48, 48), atmosphereMat);

      // Depth-attenuated geodesic wireframe lattices.
      const latticeGeo = new THREE.IcosahedronGeometry(2.28, 1);
      const innerLattice = wire(latticeGeo, 0x669fff, 0.46, 0.08, false);
      const outerLattice = wire(new THREE.OctahedronGeometry(3.25, 2), 0x146bff, 0.24, 0.04);

      // Deduplicated circular bokeh nodes on the inner lattice vertices.
      const uniqueNodes = deduplicatePositions(latticeGeo);
      latticeGeo.dispose();
      const nodeCount = uniqueNodes.length / 3;
      const nodeColors = new Float32Array(nodeCount * 3);
      const nodeSizes = new Float32Array(nodeCount);
      const iceColor = new THREE.Color(0xdcebff);
      const cobaltTextColor = new THREE.Color(0x669fff);
      for (let i = 0; i < nodeCount; i++) {
        const c = i % 3 === 0 ? iceColor : cobaltTextColor;
        nodeColors[i * 3] = c.r;
        nodeColors[i * 3 + 1] = c.g;
        nodeColors[i * 3 + 2] = c.b;
        nodeSizes[i] = i % 3 === 0 ? 0.34 : 0.25;
      }
      const nodeGeo = new THREE.BufferGeometry();
      nodeGeo.setAttribute("position", new THREE.BufferAttribute(uniqueNodes, 3));
      nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(nodeColors, 3));
      nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(nodeSizes, 1));
      const nodeMat = createBokehPointsMaterial(THREE, dpr, 0.94);
      const nodes = new THREE.Points(nodeGeo, nodeMat);

      // Precision 3D metallic-cobalt orbital gyroscope rings that catch specular glints.
      const gyroMatA = new THREE.MeshStandardMaterial({
        color: 0x669fff,
        metalness: 0.9,
        roughness: 0.16,
        emissive: 0x146bff,
        emissiveIntensity: 0.58,
        transparent: true,
        opacity: 0.46,
      });
      const gyroRingA = new THREE.Mesh(new THREE.TorusGeometry(2.92, 0.012, 8, 128), gyroMatA);
      gyroRingA.rotation.set(1.12, 0.32, 0.2);

      const gyroMatB = gyroMatA.clone();
      gyroMatB.opacity = 0.32;
      const gyroRingB = new THREE.Mesh(new THREE.TorusGeometry(3.58, 0.009, 8, 128), gyroMatB);
      gyroRingB.rotation.set(0.65, -0.5, 0.85);

      core.add(
        obsidian,
        obsidianEdges,
        atmosphere,
        innerLattice,
        outerLattice,
        nodes,
        gyroRingA,
        gyroRingB,
      );
      scene.add(core);

      // Orbital signal field + physical orbiting satellite beacons on inclined planes.
      const rings: import("three").Points[] = [];
      const ringMaterials: import("three").ShaderMaterial[] = [];
      const satellites: Array<{
        pivot: import("three").Group;
        body: import("three").Mesh;
        speed: number;
        phase: number;
      }> = [];
      const ringSpecs = [
        { radius: 3.95, count: 240, tilt: [1.15, 0.2], speed: 0.24, satSpeed: 0.58, phase: 0.4, size: 0.23 },
        { radius: 4.75, count: 300, tilt: [1.45, -0.5], speed: -0.18, satSpeed: -0.42, phase: 2.3, size: 0.19 },
        { radius: 5.65, count: 340, tilt: [0.85, 0.9], speed: 0.14, satSpeed: 0.31, phase: 4.1, size: 0.17 },
      ];
      let seed = 20261115;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      const palette = [
        new THREE.Color(0xeaf2ff),
        new THREE.Color(0x669fff),
        new THREE.Color(0x146bff),
      ];
      const satGeo = new THREE.OctahedronGeometry(0.085, 0);
      const satMat = new THREE.MeshPhysicalMaterial({
        color: 0xdcebff,
        emissive: 0x146bff,
        emissiveIntensity: 1.25,
        metalness: 0.85,
        roughness: 0.12,
      });

      for (const spec of ringSpecs) {
        const positions = new Float32Array(spec.count * 3);
        const colors = new Float32Array(spec.count * 3);
        const sizes = new Float32Array(spec.count);
        for (let i = 0; i < spec.count; i++) {
          const angle = rand() * Math.PI * 2;
          const r = spec.radius + (rand() - 0.5) * 0.55;
          positions[i * 3] = Math.cos(angle) * r;
          positions[i * 3 + 1] = (rand() - 0.5) * 0.34;
          positions[i * 3 + 2] = Math.sin(angle) * r;

          const tone = palette[i % palette.length];
          const dim = 0.5 + rand() * 0.5;
          colors[i * 3] = tone.r * dim;
          colors[i * 3 + 1] = tone.g * dim;
          colors[i * 3 + 2] = tone.b * dim;
          sizes[i] = spec.size * (0.6 + rand() * 0.9);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
        const mat = createBokehPointsMaterial(THREE, dpr, 0.88);
        const ring = new THREE.Points(geometry, mat);
        ring.rotation.set(spec.tilt[0], 0, spec.tilt[1]);
        ring.userData.speed = spec.speed;
        rings.push(ring);
        ringMaterials.push(mat);
        core.add(ring);

        // Orbiting satellite beacon locked to this inclined orbital plane.
        const pivot = new THREE.Group();
        pivot.rotation.set(spec.tilt[0], 0, spec.tilt[1]);
        const body = new THREE.Mesh(satGeo, satMat);
        body.position.set(spec.radius, 0, 0);
        const satHalo = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: primaryHaloTex,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        satHalo.scale.set(0.95, 0.95, 1);
        body.add(satHalo);
        pivot.add(body);
        core.add(pivot);
        satellites.push({ pivot, body, speed: spec.satSpeed, phase: spec.phase });
      }

      // Far field: soft depth-varied space dust drifting smoothly through space.
      const farCount = 460;
      const farPositions = new Float32Array(farCount * 3);
      const farColors = new Float32Array(farCount * 3);
      const farSizes = new Float32Array(farCount);
      for (let i = 0; i < farCount; i++) {
        farPositions[i * 3] = (rand() - 0.5) * 44;
        farPositions[i * 3 + 1] = (rand() - 0.5) * 26;
        farPositions[i * 3 + 2] = -4 - rand() * 18;
        const c = i % 4 === 0 ? palette[1] : new THREE.Color(0x8a9097);
        const dim = 0.35 + rand() * 0.65;
        farColors[i * 3] = c.r * dim;
        farColors[i * 3 + 1] = c.g * dim;
        farColors[i * 3 + 2] = c.b * dim;
        farSizes[i] = 0.14 + rand() * 0.18;
      }
      const farGeometry = new THREE.BufferGeometry();
      farGeometry.setAttribute("position", new THREE.BufferAttribute(farPositions, 3));
      farGeometry.setAttribute("aColor", new THREE.BufferAttribute(farColors, 3));
      farGeometry.setAttribute("aSize", new THREE.BufferAttribute(farSizes, 1));
      const farField = new THREE.Points(farGeometry, createBokehPointsMaterial(THREE, dpr, 0.72));
      scene.add(farField);

      // 3-point lighting rig with an orbiting cobalt key that sweeps across facets.
      scene.add(new THREE.HemisphereLight(0x669fff, 0x05070c, 0.78));
      const key = new THREE.DirectionalLight(0xc7dcff, 1.55);
      key.position.set(-5, 6, 7);
      const side = new THREE.PointLight(0x146bff, 76, 28, 1.5);
      side.position.set(4, -2, 4);
      const rim = new THREE.DirectionalLight(0x669fff, 2.05);
      rim.position.set(5, 3, -7);
      scene.add(key, side, rim);

      let baseX = 0;
      let baseY = 0;
      let baseScale = 1;
      const layout = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        const wide = w >= 900;
        baseX = wide ? 3.1 : 0;
        baseY = wide ? 0.1 : 1.45;
        baseScale = wide ? 1 : 0.62;
      };

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      let elapsed = 0;
      let last = 0;
      let frame = 0;
      let running = false;
      let targetScrollY = 0;
      let smoothScrollY = 0;
      let targetProgress = 0;
      let smoothProgress = 0;
      let prevScrollY = 0;
      let scrollVelocity = 0;

      // Spectrum stops: deep sapphire -> brand cobalt -> ice cobalt -> arctic highlight.
      const spectrumDeep = new THREE.Color(0x0f4cd6);
      const spectrumCobalt = new THREE.Color(0x146bff);
      const spectrumIce = new THREE.Color(0x669fff);
      const spectrumArctic = new THREE.Color(0xa6cbff);
      const liveInner = new THREE.Color();
      const liveRim = new THREE.Color();

      const draw = (animate: boolean) => {
        if (animate) {
          const sy = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          targetScrollY = sy;
          targetProgress = max > 0 ? Math.min(sy / max, 1) : 0;
          const deltaY = sy - prevScrollY;
          prevScrollY = sy;
          scrollVelocity += (Math.max(-1.6, Math.min(1.6, deltaY * 0.015)) - scrollVelocity) * 0.22;
          scrollVelocity *= 0.94;
        }

        const lerpFactor = animate ? 0.075 : 1;
        smoothScrollY += (targetScrollY - smoothScrollY) * lerpFactor;
        smoothProgress += (targetProgress - smoothProgress) * lerpFactor;

        const progress = smoothProgress;
        const scrollAngle = smoothScrollY * 0.0022;
        const boost = animate ? Math.min(Math.abs(scrollVelocity), 1.4) : 0;
        const signedVel = animate ? scrollVelocity : 0;

        pointer.x += (pointer.tx - pointer.x) * 0.075;
        pointer.y += (pointer.ty - pointer.y) * 0.075;

        // True orbiting movement: core orbits smoothly around its anchor while
        // moving with the visitor's scroll and pointer across every page.
        const orbitTheta = elapsed * 0.32 + scrollAngle * 0.85;
        const orbitR = baseX > 0 ? 0.42 : 0.18;
        const scrollSweepX = Math.sin(scrollAngle * 0.75 + progress * Math.PI) * (baseX > 0 ? 1.85 : 0.45);
        const companionY = Math.cos(scrollAngle * 0.9) * 0.28 - signedVel * 0.35;

        core.rotation.y = 0.5 + elapsed * 0.3 + scrollAngle * 1.15 + pointer.x * 0.55;
        core.rotation.x = 0.28 + Math.sin(elapsed * 0.52) * 0.14 + scrollAngle * 0.35 + pointer.y * 0.32;
        core.rotation.z = Math.sin(elapsed * 0.36 + scrollAngle * 0.4) * 0.1;

        core.position.set(
          baseX - scrollSweepX + Math.cos(orbitTheta) * orbitR + pointer.x * 0.42,
          baseY + companionY + Math.sin(orbitTheta * 1.3) * (orbitR * 0.65) - pointer.y * 0.28,
          Math.sin(orbitTheta) * 0.45 - Math.sin(progress * Math.PI) * 1.1,
        );
        core.scale.setScalar(baseScale * (1 + Math.sin(elapsed * 0.75) * 0.022 + progress * 0.14 + boost * 0.03));

        // Counter-rotating structural lattices & precessing gyroscopes.
        innerLattice.rotation.y = elapsed * 0.14 + scrollAngle * 0.25;
        outerLattice.rotation.y = -elapsed * 0.22 - scrollAngle * 0.35;
        outerLattice.rotation.z = elapsed * 0.15;
        gyroRingA.rotation.z = 0.2 + elapsed * 0.3 + scrollAngle * 0.65;
        gyroRingA.rotation.y = 0.32 + elapsed * 0.14;
        gyroRingB.rotation.x = 0.65 - elapsed * 0.24 - scrollAngle * 0.55;
        gyroRingB.rotation.y = -0.5 + elapsed * 0.16;

        for (let i = 0; i < rings.length; i++) {
          const ring = rings[i];
          ring.rotation.y = elapsed * (ring.userData.speed as number) + scrollAngle * (i % 2 === 0 ? 0.55 : -0.45);
        }

        // Orbiting satellite beacons revolve around the core on their inclined planes.
        for (const sat of satellites) {
          sat.pivot.rotation.y = sat.phase + elapsed * sat.speed + scrollAngle * 0.75;
          sat.body.rotation.x = elapsed * 1.2;
          sat.body.rotation.y = elapsed * 1.6;
        }

        // Far field orbits gently in counter-parallax so the camera feels moving with you.
        farField.rotation.y = elapsed * 0.022 + pointer.x * 0.04;
        farField.position.x = pointer.x * -0.55 - Math.sin(scrollAngle * 0.5) * 0.9;
        farField.position.y = pointer.y * 0.38 + (smoothScrollY * 0.0014) % 4;

        // Orbiting cobalt light sweeps across the 320 obsidian facets continuously & on scroll.
        const lightAngle = elapsed * 0.55 + scrollAngle * 1.4 + pointer.x * 0.8;
        side.position.set(Math.cos(lightAngle) * 5.2, Math.sin(lightAngle * 0.7) * 3.4, 4.2);
        side.intensity = 76 + boost * 44;

        // Volumetric spectrum glow: breathes over time & swells as you scroll any page.
        const wave = 0.5 + 0.5 * Math.sin(scrollAngle * 1.1 + elapsed * 0.55);
        liveInner.copy(spectrumDeep).lerp(spectrumCobalt, wave).lerp(spectrumIce, Math.min(boost * 0.35, 0.35));
        liveRim.copy(spectrumIce).lerp(spectrumArctic, Math.min(wave * 0.65 + boost * 0.35, 1));
        atmosphereMat.uniforms.uInnerColor.value.copy(liveInner);
        atmosphereMat.uniforms.uRimColor.value.copy(liveRim);
        atmosphereMat.uniforms.uIntensity.value = 0.36 + wave * 0.14 + Math.min(boost * 0.18, 0.24);

        const haloPulse = 1 + Math.sin(elapsed * 0.85) * 0.045 + Math.min(boost * 0.14, 0.22);
        halo.scale.set(9.8 * haloPulse, 9.8 * haloPulse, 1);
        haloMat.opacity = 0.7 + wave * 0.16 + Math.min(boost * 0.15, 0.22);

        // Background drifting glow orbs glide inside WebGL with orbit + scroll.
        sweepGlow.position.set(
          -2.2 + Math.sin(scrollAngle * 0.8 + elapsed * 0.28) * 5.2,
          -0.8 + Math.cos(scrollAngle * 0.9 + elapsed * 0.22) * 2.8,
          -5.5,
        );
        sweepGlowMat.opacity = 0.42 + wave * 0.24 + Math.min(boost * 0.2, 0.26);

        ambientGlow.position.set(
          2.6 - Math.sin(scrollAngle * 0.65 + elapsed * 0.16) * 4.4,
          1.2 + Math.cos(scrollAngle * 0.75 + elapsed * 0.2) * 2.4,
          -7.0,
        );
        ambientGlowMat.opacity = 0.22 + wave * 0.14 + Math.min(boost * 0.14, 0.2);

        const particlePulse = 1 + Math.min(boost * 0.24, 0.32);
        nodeMat.uniforms.uPulse.value = particlePulse;
        for (const mat of ringMaterials) mat.uniforms.uPulse.value = particlePulse;

        // Orbiting camera: smoothly orbits around the focal axis with pointer + scroll + idle sway.
        const camOrbitX = Math.sin(elapsed * 0.24 + scrollAngle * 0.35) * 0.35 + pointer.x * 0.72;
        const camOrbitY = Math.cos(elapsed * 0.19) * 0.22 - pointer.y * 0.46;
        camera.position.set(camOrbitX, camOrbitY, 10.6 - Math.sin(progress * Math.PI) * 0.45);
        camera.lookAt(baseX * 0.18, 0, 0);

        canvas.style.opacity = String(0.95 - progress * 0.08);

        renderer.render(scene, camera);
      };

      const loop = (now: number) => {
        if (!running) return;
        elapsed += Math.min((now - last) / 1000, 0.05);
        last = now;
        draw(true);
        frame = requestAnimationFrame(loop);
      };

      const start = () => {
        if (running || document.hidden) return;
        running = true;
        prevScrollY = window.scrollY;
        last = performance.now();
        frame = requestAnimationFrame(loop);
      };
      const stop = () => {
        running = false;
        cancelAnimationFrame(frame);
      };

      const handlePointer = (event: PointerEvent) => {
        if (!allowedRef.current || event.pointerType !== "mouse") return;
        pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.ty = (event.clientY / window.innerHeight) * 2 - 1;
      };
      const handleResize = () => {
        layout();
        if (!running) draw(false);
      };
      const handleVisibility = () => {
        if (document.hidden) stop();
        else if (allowedRef.current) start();
      };

      window.addEventListener("pointermove", handlePointer, { passive: true });
      window.addEventListener("resize", handleResize);
      document.addEventListener("visibilitychange", handleVisibility);

      controllerRef.current = {
        setRunning: (next) => {
          if (next) {
            start();
          } else {
            stop();
            // Freeze on the current frame without pointer drift or scroll animation.
            scrollVelocity = 0;
            pointer.x = pointer.y = pointer.tx = pointer.ty = 0;
            draw(false);
          }
        },
      };

      layout();
      draw(false);
      canvas.dataset.ready = "true";
      if (allowedRef.current) start();

      teardown = () => {
        stop();
        controllerRef.current = null;
        window.removeEventListener("pointermove", handlePointer);
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("visibilitychange", handleVisibility);
        scene.traverse((object) => {
          const item = object as import("three").Mesh;
          item.geometry?.dispose();
          const material = item.material;
          if (Array.isArray(material)) material.forEach((m) => m.dispose());
          else material?.dispose();
        });
        primaryHaloTex.dispose();
        driftHaloTex.dispose();
        envTarget.dispose();
        renderer.dispose();
      };
      if (disposed) teardown();
    })();

    return () => {
      disposed = true;
      teardown();
    };
  }, []);

  return (
    <div className="stage" aria-hidden="true">
      <canvas ref={canvasRef} className="stage__canvas" />
    </div>
  );
}
