import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Plus, Image as ImageIcon, Pin } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhotoItem {
  id: number;
  caption: string;
  date: string;
  tag: string;
  likes: number;
  emoji: string;
  stickyNote?: string;
}

interface MemoriesSectionProps {
  onAddHearts: (count: number) => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ onAddHearts }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>([
    {
      id: 1,
      caption: "The day we first laughed until our stomachs hurt ☕",
      date: "July Memory",
      tag: "Unforgettable",
      likes: 27,
      emoji: "🌸",
      stickyNote: "Best coffee conversation ever!",
    },
    {
      id: 2,
      caption: "Late night calls & endless random thoughts 🌌",
      date: "Midnight Vibe",
      tag: "Sweet Talk",
      likes: 42,
      emoji: "🌙",
      stickyNote: "Never get tired of hearing your voice",
    },
    {
      id: 3,
      caption: "Your radiant smile that fixes any bad day ✨",
      date: "July 27th Special",
      tag: "Pure Happiness",
      likes: 99,
      emoji: "☀️",
      stickyNote: "Keep shining always!",
    },
    {
      id: 4,
      caption: "Spontaneous boba runs and sweet treat cravings 🧋",
      date: "Snack Time",
      tag: "Boba Lover",
      likes: 33,
      emoji: "🧋",
      stickyNote: "Extra boba for the birthday girl!",
    },
  ]);

  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCaption, setNewCaption] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playCatch();
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    onAddHearts(1);
  };

  const handleAddMemory = () => {
    if (!newCaption.trim()) return;
    sounds.playUnlockSuccess();
    const newMemory: PhotoItem = {
      id: Date.now(),
      caption: newCaption,
      date: "Just Now",
      tag: newTag || "Special Moment",
      likes: 1,
      emoji: "💖",
      stickyNote: "Added with love!",
    };
    setPhotos([newMemory, ...photos]);
    setNewCaption('');
    setNewTag('');
    setShowAddModal(false);
    onAddHearts(3);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="apple-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
            Moments Gallery
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
            Memory Lane
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tap cards to zoom or send love hearts
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setShowAddModal(true);
          }}
          className="flex items-center space-x-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-apple-sm transition-transform active:scale-95 flex-shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Moment</span>
        </button>
      </div>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {photos.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              sounds.playClick();
              setActivePhoto(item);
            }}
            className="apple-card apple-card-hover p-5 cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Box */}
            <div className="w-full h-44 rounded-2xl bg-stone-100 border border-stone-200/60 flex flex-col items-center justify-center p-4 text-center">
              <span className="text-5xl mb-2">{item.emoji}</span>
              <span className="bg-white text-stone-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-stone-200/80 shadow-sm">
                {item.tag}
              </span>
            </div>

            {/* Content */}
            <div className="mt-4">
              <p className="font-serif text-base font-semibold text-stone-900 leading-snug">
                {item.caption}
              </p>

              {item.stickyNote && (
                <div className="mt-2 bg-stone-50 p-2 rounded-xl border border-stone-200/60 text-xs text-stone-600 font-medium flex items-center space-x-1.5">
                  <Pin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                  <span>{item.stickyNote}</span>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-400">
                <span>{item.date}</span>

                <button
                  onClick={(e) => handleLike(item.id, e)}
                  className="flex items-center space-x-1 text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-90"
                >
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setActivePhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-apple-lg border border-stone-200"
            >
              <div className="w-full h-48 rounded-2xl bg-stone-100 flex items-center justify-center text-6xl mb-4">
                {activePhoto.emoji}
              </div>

              <span className="inline-block bg-stone-100 text-stone-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full mb-2">
                {activePhoto.tag}
              </span>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                {activePhoto.caption}
              </h3>

              {activePhoto.stickyNote && (
                <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-600">
                  📌 Note: {activePhoto.stickyNote}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={(e) => handleLike(activePhoto.id, e)}
                  className="flex items-center space-x-1.5 bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Send Love ({activePhoto.likes})</span>
                </button>

                <button
                  onClick={() => setActivePhoto(null)}
                  className="bg-stone-100 text-stone-700 text-xs font-semibold px-4 py-2 rounded-full"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-apple-lg border border-stone-200"
            >
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-stone-500" />
                <span>Add Memory</span>
              </h3>

              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">Caption</label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Enter memory..."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-400 block mb-1">Tag (Optional)</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="e.g. Cute"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-stone-400 font-medium"
                  />
                </div>
              </div>

              <div className="mt-5 flex space-x-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 bg-stone-100 text-stone-600 font-semibold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMemory}
                  className="w-1/2 py-2 bg-stone-900 text-white font-semibold rounded-xl text-xs shadow-sm"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
