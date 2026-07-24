import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Wind, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface ThreeCakeSceneProps {
  onBlowCandlesSuccess?: () => void;
}

export const ThreeCakeScene: React.FC<ThreeCakeSceneProps> = ({ onBlowCandlesSuccess }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishMade, setWishMade] = useState<boolean>(false);
  const flamesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Optimized Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5f6, 1.2);
    dirLight.position.set(4, 8, 5);
    scene.add(dirLight);

    // Cake Group
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Minimal Plate
    const plateGeo = new THREE.CylinderGeometry(2.3, 2.1, 0.1, 32);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.y = -0.05;
    cakeGroup.add(plate);

    // Bottom Tier (Blush Soft Pink)
    const bottomGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.8, 32);
    const bottomMat = new THREE.MeshStandardMaterial({ color: 0xfecdd6, roughness: 0.3 });
    const bottomLayer = new THREE.Mesh(bottomGeo, bottomMat);
    bottomLayer.position.y = 0.4;
    cakeGroup.add(bottomLayer);

    // Top Tier (Cream)
    const topGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.7, 32);
    const topMat = new THREE.MeshStandardMaterial({ color: 0xfff5f6, roughness: 0.3 });
    const topLayer = new THREE.Mesh(topGeo, topMat);
    topLayer.position.y = 1.15;
    cakeGroup.add(topLayer);

    // Cream Pearl Trim
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const ringGeo = new THREE.TorusGeometry(1.12, 0.05, 12, 32);
    const ring = new THREE.Mesh(ringGeo, creamMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.5;
    cakeGroup.add(ring);

    // Elegant Candles & Flames
    const flames: THREE.Mesh[] = [];
    const candlePositions = [
      { x: -0.3, z: 0 },
      { x: 0, z: 0.2 },
      { x: 0.3, z: 0 },
    ];

    candlePositions.forEach((pos) => {
      const candleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.45, 16);
      const candleMat = new THREE.MeshStandardMaterial({ color: 0xe11d48 });
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(pos.x, 1.72, pos.z);
      cakeGroup.add(candle);

      const flameGeo = new THREE.SphereGeometry(0.055, 12, 12);
      flameGeo.scale(0.8, 1.6, 0.8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(pos.x, 2.0, pos.z);
      cakeGroup.add(flame);
      flames.push(flame);
    });

    flamesRef.current = flames;

    // Mouse / Touch Interaction for 360° Drag
    let isDragging = false;
    let previousX = 0;

    const onStart = (x: number) => {
      isDragging = true;
      previousX = x;
    };
    const onMove = (x: number) => {
      if (isDragging) {
        const delta = x - previousX;
        cakeGroup.rotation.y += delta * 0.01;
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
        cakeGroup.rotation.y += 0.004;
      }

      flames.forEach((flame, i) => {
        if (flame.visible) {
          const s = 1 + Math.sin(t * 10 + i) * 0.12;
          flame.scale.set(0.8 * s, 1.6 * s, 0.8 * s);
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

    flamesRef.current.forEach((flame) => {
      flame.visible = false;
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#e11d48', '#d4af37', '#ffffff'],
    });

    if (onBlowCandlesSuccess) {
      onBlowCandlesSuccess();
    }
  };

  const handleRelight = () => {
    sounds.playClick();
    setCandlesLit(true);
    setWishMade(false);
    flamesRef.current.forEach((flame) => {
      flame.visible = true;
    });
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="relative w-full h-[280px] sm:h-[320px] cursor-grab active:cursor-grabbing flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full" />
      </div>

      <div className="mt-2 flex items-center justify-center">
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
        <div className="mt-4 bg-stone-50 border border-stone-200 p-4 rounded-2xl text-center max-w-xs w-full shadow-apple-sm">
          <h3 className="font-serif text-sm font-semibold text-stone-900">Your Wish is Sent ✨</h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            May your year ahead be full of light, laughter, and happiness.
          </p>
        </div>
      )}
    </div>
  );
};
