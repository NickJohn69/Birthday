import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VaultLocker } from './components/VaultLocker';
import { Navbar, TabType } from './components/Navbar';
import { HomeSection } from './components/sections/HomeSection';
import { MemoriesSection } from './components/sections/MemoriesSection';
import { GamesSection } from './components/sections/GamesSection';
import { CouponsSection } from './components/sections/CouponsSection';
import { LetterSection } from './components/sections/LetterSection';
import { SurprisesSection } from './components/sections/SurprisesSection';
import { sounds } from './utils/audio';

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [heartPoints, setHeartPoints] = useState<number>(27); // Starts at 27 for July 27!
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingBgm, setIsPlayingBgm] = useState<boolean>(false);

  const handleAddHearts = (count: number) => {
    setHeartPoints((prev) => prev + count);
  };

  const toggleBgm = () => {
    const nextState = sounds.toggleBgm();
    setIsPlayingBgm(nextState);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans">
      {/* 1. Initial Page: Passcode Vault / Locker Gate */}
      {!isUnlocked ? (
        <VaultLocker
          onUnlockSuccess={() => {
            setIsUnlocked(true);
            toggleBgm(); // Auto-start soft background music arpeggio on unlock!
          }}
        />
      ) : (
        /* 2. Main Sanctuary Multi-page / Multi-tab App */
        <div className="flex-1 flex flex-col">
          {/* Header Navigation */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            heartPoints={heartPoints}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isPlayingBgm={isPlayingBgm}
            toggleBgm={toggleBgm}
          />

          {/* Main Tab Content Display */}
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                {activeTab === 'home' && (
                  <HomeSection
                    onAddHearts={handleAddHearts}
                    setActiveTab={setActiveTab}
                  />
                )}
                {activeTab === 'memories' && (
                  <MemoriesSection onAddHearts={handleAddHearts} />
                )}
                {activeTab === 'games' && (
                  <GamesSection onAddHearts={handleAddHearts} />
                )}
                {activeTab === 'coupons' && (
                  <CouponsSection onAddHearts={handleAddHearts} />
                )}
                {activeTab === 'letter' && (
                  <LetterSection onAddHearts={handleAddHearts} />
                )}
                {activeTab === 'surprises' && (
                  <SurprisesSection onAddHearts={handleAddHearts} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
