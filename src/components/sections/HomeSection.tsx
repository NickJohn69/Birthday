import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Gift, PartyPopper, Smile, ArrowRight } from 'lucide-react';
import { ThreeCakeScene } from '../ThreeCakeScene';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';
import { TabType } from '../Navbar';

interface HomeSectionProps {
  onAddHearts: (count: number) => void;
  setActiveTab: (tab: TabType) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onAddHearts, setActiveTab }) => {
  const [complimentIndex, setComplimentIndex] = useState<number>(0);
  const [complimentCount, setComplimentCount] = useState<number>(0);

  const compliments = [
    "Your smile brings genuine light into every room you enter.",
    "You are 100% genuine, endlessly kind, and truly irreplaceable.",
    "The world became significantly sweeter on July 27th.",
    "You make ordinary, quiet moments feel like unforgettable movie scenes.",
    "Just a sweet reminder: You are doing wonderfully and appreciated always.",
  ];

  const handleNextCompliment = () => {
    sounds.playClick();
    setComplimentIndex((prev) => (prev + 1) % compliments.length);
    setComplimentCount((prev) => prev + 1);
    onAddHearts(1);
  };

  const handleConfettiBlast = () => {
    sounds.playPop();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#e11d48', '#d4af37', '#ffffff'],
    });
    onAddHearts(2);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Editorial Birthday Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="apple-card p-6 sm:p-10 text-center relative overflow-hidden"
      >
        <div className="inline-flex items-center space-x-1.5 bg-rose-50 text-rose-700 font-semibold text-xs px-3.5 py-1 rounded-full border border-rose-200/60 mb-3">
          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
          <span>July 27th Birthday Wish</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-stone-900 tracking-tight leading-tight">
          Happy Birthday, <span className="italic text-rose-600 font-normal">Samrakshuu</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-500 max-w-md mx-auto font-normal leading-relaxed">
          Welcome to your minimal interactive digital sanctuary. Thoughtfully crafted to celebrate you today.
        </p>

        {/* Hero Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={handleConfettiBlast}
            className="flex items-center space-x-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-apple-sm transition-transform active:scale-95"
          >
            <PartyPopper className="w-3.5 h-3.5 text-stone-300" />
            <span>Pop Celebration</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('letter');
            }}
            className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-4 py-2.5 rounded-full border border-stone-200 shadow-sm transition-transform active:scale-95"
          >
            <Gift className="w-3.5 h-3.5 text-stone-600" />
            <span>Read Birthday Note</span>
          </button>
        </div>
      </motion.div>

      {/* 3D Birthday Cake Card */}
      <div className="apple-card p-6 text-center">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-2">
          <h2 className="font-serif text-lg font-semibold text-stone-900">
            Interactive Cake
          </h2>
          <span className="text-xs text-stone-400 font-medium">3D Candle Blow</span>
        </div>

        <ThreeCakeScene onBlowCandlesSuccess={() => onAddHearts(5)} />
      </div>

      {/* Compliment Capsule */}
      <div className="apple-card p-6 bg-gradient-to-br from-stone-50 to-rose-50/40 border border-stone-200/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-stone-800 font-semibold text-sm">
            <Smile className="w-4 h-4 text-rose-500" />
            <span>Compliment Capsule</span>
          </div>
          <span className="text-[11px] font-medium text-stone-400">
            Unlocked: {complimentCount}
          </span>
        </div>

        <div className="bg-white/90 p-4 rounded-2xl border border-stone-200/60 my-2 text-center shadow-apple-sm min-h-[75px] flex items-center justify-center">
          <p className="font-serif italic text-sm sm:text-base text-stone-800">
            "{compliments[complimentIndex]}"
          </p>
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={handleNextCompliment}
            className="flex items-center space-x-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-full transition-transform active:scale-95"
          >
            <span>Next Compliment</span>
            <Sparkles className="w-3 h-3 text-stone-300" />
          </button>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => {
            sounds.playClick();
            setActiveTab('memories');
          }}
          className="apple-card apple-card-hover p-5 cursor-pointer flex items-center justify-between"
        >
          <div>
            <h3 className="font-serif text-base font-semibold text-stone-900">Moments & Memories</h3>
            <p className="text-xs text-stone-400 mt-0.5">Explore polaroid cards & notes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </div>

        <div
          onClick={() => {
            sounds.playClick();
            setActiveTab('coupons');
          }}
          className="apple-card apple-card-hover p-5 cursor-pointer flex items-center justify-between"
        >
          <div>
            <h3 className="font-serif text-base font-semibold text-stone-900">Romantic Coupons</h3>
            <p className="text-xs text-stone-400 mt-0.5">6 redeemable birthday vouchers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-stone-400" />
        </div>
      </div>
    </div>
  );
};
