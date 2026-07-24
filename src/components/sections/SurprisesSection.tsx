import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface GiftBox {
  id: number;
  title: string;
  surpriseTitle: string;
  surpriseDesc: string;
  emoji: string;
  isUnwrapped: boolean;
}

interface SurprisesSectionProps {
  onAddHearts: (count: number) => void;
}

export const SurprisesSection: React.FC<SurprisesSectionProps> = ({ onAddHearts }) => {
  const [boxes, setBoxes] = useState<GiftBox[]>([
    {
      id: 1,
      title: "Gift #1: Music Box 🎵",
      surpriseTitle: "Curated Birthday Vibe Mix",
      surpriseDesc: "A warm acoustic melody dedicated to making your birthday relaxing and bright!",
      emoji: "🎵",
      isUnwrapped: false,
    },
    {
      id: 2,
      title: "Gift #2: Wishing Star ⭐",
      surpriseTitle: "Golden Shooting Star Badge",
      surpriseDesc: "You can make 3 wishes today and all of them are guaranteed to come true!",
      emoji: "⭐",
      isUnwrapped: false,
    },
    {
      id: 3,
      title: "Gift #3: Golden Key 🗝️",
      surpriseTitle: "Golden Key to Happiness",
      surpriseDesc: "Unlocks priority support and VIP treatment whenever you call or text!",
      emoji: "🔑",
      isUnwrapped: false,
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [constellationDone, setConstellationDone] = useState<boolean>(false);
  const [connectedCount, setConnectedCount] = useState<number>(0);

  // 10 Star Points explicitly arranged in a perfect Heart Shape
  const starPoints = [
    { x: 210, y: 90 },  // Top center dip
    { x: 165, y: 65 },  // Left top arch
    { x: 120, y: 88 },  // Left lobe peak
    { x: 105, y: 132 }, // Left side waist
    { x: 145, y: 185 }, // Left lower slope
    { x: 210, y: 235 }, // Bottom heart tip
    { x: 275, y: 185 }, // Right lower slope
    { x: 315, y: 132 }, // Right side waist
    { x: 300, y: 88 },  // Right lobe peak
    { x: 255, y: 65 },  // Right top arch
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background ambient stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    const bgStars = [
      { x: 40, y: 40 }, { x: 380, y: 50 }, { x: 50, y: 220 }, { x: 370, y: 230 },
      { x: 80, y: 120 }, { x: 340, y: 150 }, { x: 190, y: 30 }, { x: 230, y: 260 }
    ];
    bgStars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    const isComplete = connectedCount === starPoints.length;

    // Draw connected path
    if (connectedCount > 1) {
      ctx.beginPath();
      ctx.moveTo(starPoints[0].x, starPoints[0].y);
      for (let i = 1; i < connectedCount; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
      }
      if (isComplete) {
        ctx.closePath();
      }

      // If fully connected: Fill heart with glowing vibrant red color!
      if (isComplete) {
        ctx.fillStyle = 'rgba(225, 29, 72, 0.85)'; // Vibrant Crimson Red
        ctx.shadowColor = '#e11d48';
        ctx.shadowBlur = 20;
        ctx.fill();
      }

      // Stroke border line
      ctx.strokeStyle = isComplete ? '#ffffff' : '#fb7185';
      ctx.lineWidth = isComplete ? 3.5 : 2.5;
      ctx.shadowColor = isComplete ? '#ffffff' : '#fb7185';
      ctx.shadowBlur = isComplete ? 15 : 8;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow
    }

    // Draw Heart-shaped nodes at each point
    ctx.font = '14px serif';
    starPoints.forEach((pt, idx) => {
      const isActivated = idx < connectedCount;
      // Draw heart character
      ctx.fillStyle = isActivated ? '#ff4d4f' : 'rgba(255,255,255,0.4)';
      if (isActivated) {
        ctx.shadowColor = '#ff4d4f';
        ctx.shadowBlur = 8;
      }
      ctx.fillText('❤️', pt.x - 7, pt.y + 5);
      ctx.shadowBlur = 0;
    });
  }, [connectedCount]);

  const handleStarClick = () => {
    if (connectedCount < starPoints.length) {
      sounds.playCatch();
      const nextCount = connectedCount + 1;
      setConnectedCount(nextCount);
      if (nextCount === starPoints.length) {
        setConstellationDone(true);
        sounds.playUnlockSuccess();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#d4af37', '#ffffff'],
        });
        onAddHearts(10);
      }
    }
  };

  const handleResetConstellation = () => {
    sounds.playClick();
    setConnectedCount(0);
    setConstellationDone(false);
  };

  const handleUnwrapGift = (id: number) => {
    sounds.playUnlockSuccess();
    setBoxes((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isUnwrapped: true } : b))
    );
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#d4af37', '#ffffff'],
    });
    onAddHearts(5);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="apple-card p-6">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
          Unboxing Experience
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
          Virtual Gift Presents 🎁
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Tap gift boxes below to unwrap your birthday surprises.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="apple-card p-5 text-center flex flex-col items-center justify-between min-h-[190px]"
          >
            {!box.isUnwrapped ? (
              <>
                <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-2xl mb-2">
                  🎁
                </div>
                <h3 className="font-serif text-base font-semibold text-stone-900">{box.title}</h3>
                <p className="text-xs text-stone-400 my-1">Wrapped present</p>
                <button
                  onClick={() => handleUnwrapGift(box.id)}
                  className="bg-stone-900 hover:bg-black text-white font-semibold text-xs px-4 py-1.5 rounded-full transition-transform active:scale-95 shadow-sm mt-2"
                >
                  Unwrap Present
                </button>
              </>
            ) : (
              <div className="space-y-2 py-2">
                <div className="text-4xl mb-1">{box.emoji}</div>
                <h3 className="font-serif text-base font-semibold text-stone-900">{box.surpriseTitle}</h3>
                <p className="text-xs text-stone-500">{box.surpriseDesc}</p>
                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200 mt-1">
                  ✓ Unlocked +5 Hearts
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Sky Heart Constellation */}
      <div className="apple-card p-6 text-center">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
          Interactive Sky
        </span>
        <h3 className="font-serif text-xl font-semibold text-stone-900">
          Connect the July 27th Star Heart ✨
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 max-w-xs mx-auto">
          Tap on the stars to connect the constellation lines and fill the heart with crimson red!
        </p>

        <div className="my-4 flex justify-center">
          <div className="border border-stone-800 rounded-2xl bg-stone-950 p-2 shadow-inner">
            <canvas
              ref={canvasRef}
              width={420}
              height={280}
              onClick={handleStarClick}
              className="cursor-pointer max-w-full"
            />
          </div>
        </div>

        <div>
          {!constellationDone ? (
            <button
              onClick={handleStarClick}
              className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-5 py-2 rounded-full shadow-sm"
            >
              Connect Star #{connectedCount + 1} ⭐
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-rose-700 font-semibold text-xs bg-rose-50 border border-rose-200 p-2.5 rounded-full max-w-xs mx-auto flex items-center justify-center space-x-1.5">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>Star Heart Completed! (+10 Hearts)</span>
              </div>
              <button
                onClick={handleResetConstellation}
                className="text-[11px] text-stone-400 hover:text-stone-600 underline font-medium"
              >
                Reset Constellation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
