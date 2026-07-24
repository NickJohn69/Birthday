import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wind, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface ThreeCakeSceneProps {
  onBlowCandlesSuccess?: () => void;
}

export const ThreeCakeScene: React.FC<ThreeCakeSceneProps> = ({ onBlowCandlesSuccess }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const flamesRef = useRef<THREE.Group[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);
  const smokeParticlesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 7.2);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);

    // Warm Ambient Light
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xfff1f2, 1.8);
    keyLight.position.set(4, 9, 6);
    scene.add(keyLight);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    // Main Cake Container Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // 1. Elegant Porcelain Cake Stand with Gold Trim Base
    const standPedestalGeo = new THREE.CylinderGeometry(0.8, 1.4, 0.6, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.2,
    });
    const pedestal = new THREE.Mesh(standPedestalGeo, goldMat);
    pedestal.position.y = -0.3;
    cakeGroup.add(pedestal);

    const standPlateGeo = new THREE.CylinderGeometry(2.6, 2.5, 0.12, 48);
    const porcelainMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.05,
    });
    const standPlate = new THREE.Mesh(standPlateGeo, porcelainMat);
    standPlate.position.y = 0.05;
    cakeGroup.add(standPlate);

    const standRimGeo = new THREE.TorusGeometry(2.55, 0.04, 16, 48);
    const standRim = new THREE.Mesh(standRimGeo, goldMat);
    standRim.rotation.x = Math.PI / 2;
    standRim.position.y = 0.11;
    cakeGroup.add(standRim);

    // 2. Multi-tier Luxury Cake Layers
    // Materials
    const pinkCreamMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6, // Elegant rose silk
      roughness: 0.35,
      metalness: 0.02,
    });
    const vanillaCreamMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf7, // Pure velvet cream
      roughness: 0.25,
      metalness: 0.02,
    });
    const strawberryJamMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.15,
      metalness: 0.1,
    });

    // Bottom Layer (Rose Pink)
    const bottomTier = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.9, 48), pinkCreamMat);
    bottomTier.position.y = 0.56;
    cakeGroup.add(bottomTier);

    // Middle Layer (Vanilla Cream)
    const middleTier = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.8, 48), vanillaCreamMat);
    middleTier.position.y = 1.35;
    cakeGroup.add(middleTier);

    // Strawberry Drip Layer / Accent Ring
    const dripRing = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.05, 16, 48), strawberryJamMat);
    dripRing.rotation.x = Math.PI / 2;
    dripRing.position.y = 1.74;
    cakeGroup.add(dripRing);

    // 3. Piped Whipped Cream Swirls (Rims Decoration)
    const creamDollopGeo = new THREE.SphereGeometry(0.08, 12, 12);
    creamDollopGeo.scale(1, 1.3, 1);

    // Top Rim Whipped Cream Swirls (12 Dollops)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const dollop = new THREE.Mesh(creamDollopGeo, vanillaCreamMat);
      dollop.position.set(1.22 * Math.cos(angle), 1.76, 1.22 * Math.sin(angle));
      dollop.rotation.z = Math.random() * 0.2;
      cakeGroup.add(dollop);
    }

    // Base Rim Whipped Cream Swirls (16 Dollops)
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dollop = new THREE.Mesh(creamDollopGeo, vanillaCreamMat);
      dollop.position.set(1.76 * Math.cos(angle), 1.02, 1.76 * Math.sin(angle));
      cakeGroup.add(dollop);
    }

    // 4. Realistic 3D Strawberries on Top
    const strawGeo = new THREE.ConeGeometry(0.14, 0.26, 16);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 }); // Fresh strawberry core
    const strawSkinMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.15, metalness: 0.05 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.4 });

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + 0.3;
      const strawGroup = new THREE.Group();

      const body = new THREE.Mesh(strawGeo, strawSkinMat);
      body.rotation.x = Math.PI;
      strawGroup.add(body);

      // Green Leaf Crown
      for (let l = 0; l < 4; l++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.1, 8), leafMat);
        leaf.rotation.z = (l * Math.PI) / 2 + 0.3;
        leaf.position.y = 0.12;
        strawGroup.add(leaf);
      }

      strawGroup.position.set(0.75 * Math.cos(angle), 1.88, 0.75 * Math.sin(angle));
      strawGroup.rotation.y = Math.random() * Math.PI;
      cakeGroup.add(strawGroup);
    }

    // 5. Golden Pearl Sprinkles & Foil Accents
    const pearlGeo = new THREE.SphereGeometry(0.035, 8, 8);
    for (let i = 0; i < 28; i++) {
      const r = Math.random() * 1.1;
      const theta = Math.random() * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, goldMat);
      pearl.position.set(r * Math.cos(theta), 1.76, r * Math.sin(theta));
      cakeGroup.add(pearl);
    }

    // 6. Tall Luxury Spiral Candles & Dynamic Glowing Flames
    const flameGroups: THREE.Group[] = [];
    const candleLights: THREE.PointLight[] = [];

    const candlePositions = [
      { x: -0.32, z: 0.1 },
      { x: 0, z: -0.2 },
      { x: 0.32, z: 0.1 },
    ];

    const candleBodyMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf7,
      roughness: 0.2,
    });
    const goldSpiralMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
    });

    candlePositions.forEach((pos) => {
      // Candle stick
      const candleStick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.55, 16), candleBodyMat);
      candleStick.position.set(pos.x, 2.02, pos.z);
      cakeGroup.add(candleStick);

      // Gold spiral ring wrapping candle
      const spiralRing = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.008, 8, 24), goldSpiralMat);
      spiralRing.rotation.x = Math.PI / 3;
      spiralRing.position.set(pos.x, 2.1, pos.z);
      cakeGroup.add(spiralRing);

      // Candle Wick
      const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
      wick.position.set(pos.x, 2.32, pos.z);
      cakeGroup.add(wick);

      // Multi-layer Glowing Flame Mesh
      const flameGroup = new THREE.Group();

      // Outer Flame Halo (Warm Orange Glow)
      const outerFlameGeo = new THREE.SphereGeometry(0.055, 12, 12);
      outerFlameGeo.scale(0.8, 1.8, 0.8);
      const outerFlameMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.85,
      });
      const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);

      // Inner Flame Core (Bright Yellow/White)
      const innerFlameGeo = new THREE.SphereGeometry(0.035, 10, 10);
      innerFlameGeo.scale(0.7, 1.5, 0.7);
      const innerFlameMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);

      flameGroup.add(outerFlame);
      flameGroup.add(innerFlame);
      flameGroup.position.set(pos.x, 2.4, pos.z);
      cakeGroup.add(flameGroup);
      flameGroups.push(flameGroup);

      // Pointlight attached to each candle flame
      const candleLight = new THREE.PointLight(0xfbbf24, 0.8, 3.5);
      candleLight.position.set(pos.x, 2.42, pos.z);
      cakeGroup.add(candleLight);
      candleLights.push(candleLight);
    });

    flamesRef.current = flameGroups;
    lightsRef.current = candleLights;

    // Mouse / Touch 360° Drag Handler
    let isDragging = false;
    let previousX = 0;

    const onStart = (x: number) => {
      isDragging = true;
      previousX = x;
    };
    const onMove = (x: number) => {
      if (isDragging) {
        const delta = x - previousX;
        cakeGroup.rotation.y += delta * 0.008;
        previousX = x;
      }
    };
    const onEnd = () => {
      isDragging = false;
    };

    const dom = mountRef.current;
    const handleMouseDown = (e: MouseEvent) => onStart(e.clientX);
    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX);
    const handleMouseUp = () => onEnd();

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) onStart(e.touches[0].clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) onMove(e.touches[0].clientX);
    };
    const handleTouchEnd = () => onEnd();

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    dom.addEventListener('touchstart', handleTouchStart);
    dom.addEventListener('touchmove', handleTouchMove);
    dom.addEventListener('touchend', handleTouchEnd);

    // Optimized Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!isDragging) {
        cakeGroup.rotation.y += 0.0035;
      }

      // Flame Flicker & Light Intensity Pulse
      flameGroups.forEach((flameGroup, i) => {
        if (flameGroup.visible) {
          const flicker = 1 + Math.sin(t * 14 + i * 2) * 0.12 + Math.cos(t * 22 + i) * 0.05;
          flameGroup.scale.set(0.9 * flicker, 1.4 * flicker, 0.9 * flicker);

          if (candleLights[i]) {
            candleLights[i].intensity = 0.7 * flicker;
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      if (dom.contains(renderer.domElement)) {
        dom.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleBlowCandles = () => {
    sounds.playBlowCandle();
    setCandlesLit(false);
    setWishMade(true);

    flamesRef.current.forEach((fg) => {
      fg.visible = false;
    });
    lightsRef.current.forEach((light) => {
      light.intensity = 0;
    });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#d4af37', '#e11d48', '#ffffff'],
    });

    if (onBlowCandlesSuccess) {
      onBlowCandlesSuccess();
    }
  };

  const handleRelight = () => {
    sounds.playClick();
    setCandlesLit(true);
    setWishMade(false);
    flamesRef.current.forEach((fg) => {
      fg.visible = true;
    });
    lightsRef.current.forEach((light) => {
      light.intensity = 0.8;
    });
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full h-[300px] sm:h-[350px] cursor-grab active:cursor-grabbing flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      <div className="mt-1 flex items-center justify-center">
        {candlesLit ? (
          <button
            onClick={handleBlowCandles}
            className="flex items-center space-x-2 bg-stone-900 hover:bg-black text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-apple-md transition-transform active:scale-95"
          >
            <Wind className="w-4 h-4 text-stone-300" />
            <span>Make a Wish & Blow Candles</span>
          </button>
        ) : (
          <button
            onClick={handleRelight}
            className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs px-4 py-2 rounded-full border border-stone-200 shadow-sm transition-transform active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Relight Candles</span>
          </button>
        )}
      </div>

      {wishMade && (
        <div className="mt-4 bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center max-w-xs w-full shadow-apple-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-500 mx-auto mb-1 animate-spin" style={{ animationDuration: '6s' }} />
          <h3 className="font-serif text-sm font-semibold text-stone-900">Your Wish is Sent to the Stars ✨</h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            May your year ahead be overflowing with happiness, love, and sweet moments.
          </p>
        </div>
      )}
    </div>
  );
};
