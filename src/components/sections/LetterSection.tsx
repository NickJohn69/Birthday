import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, Feather } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface LetterSectionProps {
  onAddHearts: (count: number) => void;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ onAddHearts }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  const fullLetterMessage = `Happy Birthday to the most amazing person! 🎂✨

From the moment July 27th arrived, I wanted to create something truly special for you—a digital sanctuary that brings a genuine smile to your face.

You have this remarkable ability to make ordinary days feel lighter, brighter, and full of warmth. Your laugh, your energy, and your sweet vibe mean more than words can express.

May this new year of your life be overflowing with endless happiness, hilarious memories, delicious boba dates, dream achievements, and all the sweet moments you deserve!

Thank you for being so wonderful.

Happy Birthday, always! ❤️`;

  useEffect(() => {
    if (!isOpen) return;

    let index = 0;
    setTypedText('');
    setIsTypingComplete(false);

    const typingTimer = setInterval(() => {
      if (index < fullLetterMessage.length) {
        setTypedText(fullLetterMessage.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingTimer);
        setIsTypingComplete(true);
      }
    }, 24);

    return () => clearInterval(typingTimer);
  }, [isOpen]);

  const handleOpenEnvelope = () => {
    sounds.playUnlockSuccess();
    setIsOpen(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e11d48', '#d4af37', '#ffffff'],
    });
    onAddHearts(5);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="apple-card p-6 text-center">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
          Handwritten Note
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
          A Letter For You 💌
        </h2>
        <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
          Unseal the letter to read your birthday message.
        </p>
      </div>

      <div className="flex justify-center">
        {!isOpen ? (
          <div
            onClick={handleOpenEnvelope}
            className="w-full max-w-sm apple-card apple-card-hover p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[260px]"
          >
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex flex-col items-center justify-center mb-4 shadow-sm font-serif text-xs font-semibold">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 mb-0.5" />
              <span>0727</span>
            </div>

            <h3 className="font-serif text-xl font-semibold text-stone-900">
              Open Letter 💌
            </h3>
            <p className="text-xs text-stone-400 font-medium mt-1">
              Tap to unseal envelope
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg apple-card p-6 sm:p-10 border border-stone-200 shadow-apple-md relative"
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-4 mb-6">
              <span className="font-serif text-lg font-semibold text-stone-900">
                July 27th, 2026
              </span>
              <span className="text-xs text-stone-400 font-medium bg-stone-100 px-3 py-1 rounded-full">
                For Samrakshuu
              </span>
            </div>

            <div className="min-h-[240px] whitespace-pre-line font-sans text-stone-700 leading-relaxed text-sm font-normal">
              {typedText}
              {!isTypingComplete && (
                <span className="inline-block w-1.5 h-4 bg-rose-500 ml-1 animate-pulse" />
              )}
            </div>

            {isTypingComplete && (
              <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="font-serif italic text-base text-stone-800">
                  Always & Forever ❤️
                </span>

                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-4 py-2 rounded-full"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
