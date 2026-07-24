import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Star } from 'lucide-react';
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

  const starPoints = [
    { x: 140, y: 70 },
    { x: 210, y: 45 },
    { x: 280, y: 70 },
    { x: 320, y: 130 },
    { x: 210, y: 240 },
    { x: 100, y: 130 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (connectedCount > 1) {
      ctx.beginPath();
      ctx.moveTo(starPoints[0].x, starPoints[0].y);
      for (let i = 1; i < connectedCount; i++) {
        ctx.lineTo(starPoints[i].x, starPoints[i].y);
      }
      if (connectedCount === starPoints.length) {
        ctx.lineTo(starPoints[0].x, starPoints[0].y);
      }
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    starPoints.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, idx < connectedCount ? 7 : 4, 0, Math.PI * 2);
      ctx.fillStyle = idx < connectedCount ? '#f43f5e' : '#a8a29e';
      ctx.fill();
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#d4af37', '#ffffff'],
        });
        onAddHearts(10);
      }
    }
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

      {/* Night Sky Constellation */}
      <div className="apple-card p-6 text-center">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
          Interactive Sky
        </span>
        <h3 className="font-serif text-xl font-semibold text-stone-900">
          Connect the July 27th Constellation ✨
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 max-w-xs mx-auto">
          Tap on stars to connect the constellation lines and form a star heart.
        </p>

        <div className="my-4 flex justify-center">
          <div className="border border-stone-200 rounded-2xl bg-stone-50 p-2">
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
            <div className="text-emerald-700 font-semibold text-xs bg-emerald-50 border border-emerald-200 p-2.5 rounded-full max-w-xs mx-auto">
              🎉 Star Constellation Completed! (+10 Hearts)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
