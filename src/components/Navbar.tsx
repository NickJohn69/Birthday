import React from 'react';
import { motion } from 'framer-motion';
import { Cake, Camera, Gamepad2, Ticket, Mail, Gift, Volume2, VolumeX, Heart } from 'lucide-react';
import { sounds } from '../utils/audio';

export type TabType = 'home' | 'memories' | 'games' | 'coupons' | 'letter' | 'surprises';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  heartPoints: number;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isPlayingBgm: boolean;
  toggleBgm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  heartPoints,
  isMuted,
  setIsMuted,
  isPlayingBgm,
  toggleBgm,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Wish', icon: <Cake className="w-4 h-4" /> },
    { id: 'memories', label: 'Memories', icon: <Camera className="w-4 h-4" /> },
    { id: 'games', label: 'Arcade', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'coupons', label: 'Coupons', icon: <Ticket className="w-4 h-4" /> },
    { id: 'letter', label: 'Letter', icon: <Mail className="w-4 h-4" /> },
    { id: 'surprises', label: 'Gifts', icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#faf8f6]/85 backdrop-blur-md border-b border-stone-200/60 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {/* Minimal Title */}
          <div className="flex items-center space-x-2">
            <span className="font-serif text-lg font-semibold tracking-tight text-stone-900">
              July 27th <span className="text-rose-500 font-normal italic">Sanctuary</span>
            </span>
          </div>

          {/* Controls: Hearts & Audio */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full text-xs font-semibold text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{heartPoints}</span>
            </div>

            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                sounds.setMuted(nextMute);
                if (!nextMute && !isPlayingBgm) {
                  toggleBgm();
                }
              }}
              className="p-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* iOS Floating Bottom Tab Bar */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-apple-md rounded-full p-1.5">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-colors ${
                  isActive ? 'text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-stone-100 rounded-full border border-stone-200 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                {tab.icon}
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
