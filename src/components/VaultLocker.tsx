import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Sparkles, Delete, HelpCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface VaultLockerProps {
  onUnlockSuccess: () => void;
}

export const VaultLocker: React.FC<VaultLockerProps> = ({ onUnlockSuccess }) => {
  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const CORRECT_PIN = '0727';

  // Keyboard input listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocking) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isUnlocking]);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4 && !isUnlocking) {
      sounds.playClick();
      const newPin = pin + digit;
      setPin(newPin);
      setErrorMessage(null);

      if (newPin.length === 4) {
        setTimeout(() => {
          verifyPin(newPin);
        }, 120);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isUnlocking) {
      sounds.playClick();
      setPin((prev) => prev.slice(0, -1));
      setErrorMessage(null);
    }
  };

  const verifyPin = (currentPin: string) => {
    if (currentPin === CORRECT_PIN) {
      sounds.playUnlockSuccess();
      setIsUnlocking(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#d4af37', '#ffffff'],
      });

      setTimeout(() => {
        onUnlockSuccess();
      }, 700);
    } else {
      sounds.playError();
      setErrorShake(true);
      setErrorMessage('Incorrect passcode. Try her birthday!');
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-between p-6 z-50 bg-[#faf8f6] select-none gpu-accelerated">
      {/* Top Header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-4">
        <div className="flex items-center space-x-1.5 text-xs font-semibold tracking-wider text-stone-400 uppercase">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>July 27th Vault</span>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            setShowHintModal(true);
          }}
          className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200/60"
        >
          Hint
        </button>
      </div>

      {/* Center Passcode Section (Apple iOS Passcode Aesthetic) */}
      <motion.div
        animate={
          errorShake
            ? { x: [-10, 10, -8, 8, -4, 4, 0] }
            : isUnlocking
            ? { scale: [1, 1.05, 0.95], opacity: [1, 1, 0] }
            : {}
        }
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs flex flex-col items-center text-center my-auto"
      >
        {/* Minimal Lock Icon */}
        <div className="w-14 h-14 rounded-full bg-white border border-stone-200 shadow-apple-sm flex items-center justify-center mb-6 text-stone-800">
          {isUnlocking ? (
            <Unlock className="w-6 h-6 text-rose-500 animate-pulse" />
          ) : (
            <Lock className="w-6 h-6 text-stone-700" />
          )}
        </div>

        <h2 className="text-2xl font-serif font-semibold text-stone-900 tracking-tight mb-1">
          {isUnlocking ? 'Unlocking...' : 'Enter Passcode'}
        </h2>
        <p className="text-xs text-stone-400 font-medium mb-8">
          Unlock with her 4-digit birthday code
        </p>

        {/* PIN Indicators (4 Minimal Dots) */}
        <div className="flex items-center justify-center space-x-5 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={{ scale: isFilled ? 1.15 : 1 }}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-rose-500 shadow-sm scale-110'
                    : 'bg-stone-200 border border-stone-300'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 px-3 py-1.5 rounded-full mb-6 flex items-center space-x-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keypad Grid (Apple-style circular buttons) */}
        <div className="grid grid-cols-3 gap-5 w-full max-w-[260px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              disabled={isUnlocking}
              className="w-16 h-16 rounded-full bg-white hover:bg-stone-50 border border-stone-200/80 shadow-apple-sm text-stone-800 font-medium text-2xl flex items-center justify-center mx-auto transition-transform active:scale-90"
            >
              {num}
            </button>
          ))}

          {/* Bottom row */}
          <div className="w-16 h-16" />
          <button
            onClick={() => handleKeyPress('0')}
            disabled={isUnlocking}
            className="w-16 h-16 rounded-full bg-white hover:bg-stone-50 border border-stone-200/80 shadow-apple-sm text-stone-800 font-medium text-2xl flex items-center justify-center mx-auto transition-transform active:scale-90"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={isUnlocking}
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-stone-500 hover:text-stone-900 transition-transform active:scale-90"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="pb-4 text-[11px] font-medium text-stone-400">
        Crafted for July 27th ✨
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/30 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-apple-lg border border-stone-200"
            >
              <h3 className="text-lg font-serif font-semibold text-stone-900 mb-2">Passcode Hint</h3>
              <p className="text-xs text-stone-600 mb-4 leading-relaxed bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
                Her birthday in MMDD format (July 27th):<br />
                <span className="font-semibold text-rose-600 mt-1 inline-block text-sm">PIN: 0727</span>
              </p>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHintModal(false);
                }}
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
