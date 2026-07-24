import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

interface CouponItem {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  code: string;
  isRedeemed: boolean;
}

interface CouponsSectionProps {
  onAddHearts: (count: number) => void;
}

export const CouponsSection: React.FC<CouponsSectionProps> = ({ onAddHearts }) => {
  const [coupons, setCoupons] = useState<CouponItem[]>([
    {
      id: 1,
      title: "1 Free Coffee & Boba Date ☕🧋",
      subtitle: "Includes any topping & sweet treat of your choice",
      emoji: "🧋",
      code: "BOBA-0727",
      isRedeemed: false,
    },
    {
      id: 2,
      title: "Movie & Snack Selection Power 🍿🎬",
      subtitle: "You pick whatever movie or show to watch without complaints",
      emoji: "🍿",
      code: "MOVIE-NIGHT",
      isRedeemed: false,
    },
    {
      id: 3,
      title: "Unlimited Warm Hugs Pass 🫂",
      subtitle: "Valid 24 hours a day, 7 days a week. Never expires",
      emoji: "🫂",
      code: "HUGS-FOREVER",
      isRedeemed: false,
    },
    {
      id: 4,
      title: "Late Night Conversation Ticket 📞🌙",
      subtitle: "Redeem whenever you want to talk or need someone to listen",
      emoji: "📞",
      code: "MIDNIGHT-CALL",
      isRedeemed: false,
    },
    {
      id: 5,
      title: "Dessert & Ice Cream Power 🍰🍦",
      subtitle: "One full order of whatever sweet craving strikes you",
      emoji: "🍨",
      code: "SWEET-TREAT",
      isRedeemed: false,
    },
    {
      id: 6,
      title: "One Full Day VIP Treatment 👑✨",
      subtitle: "Princess privileges for an entire day",
      emoji: "👑",
      code: "QUEEN-DAY",
      isRedeemed: false,
    },
  ]);

  const [redeemedCoupon, setRedeemedCoupon] = useState<CouponItem | null>(null);

  const handleRedeem = (id: number) => {
    sounds.playUnlockSuccess();
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRedeemed: true } : c))
    );
    const target = coupons.find((c) => c.id === id);
    if (target) {
      setRedeemedCoupon(target);
    }

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
      <div className="apple-card p-6">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
          Love Vouchers
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
          Birthday Coupons 🎟️
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Officially valid vouchers to redeem anytime. Tap to claim.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="apple-card p-5 relative flex flex-col justify-between min-h-[170px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl p-2 bg-stone-100 rounded-xl border border-stone-200/60">
                {coupon.emoji}
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                {coupon.code}
              </span>
            </div>

            <div className="my-3">
              <h3 className="font-serif text-base font-semibold text-stone-900 leading-snug">
                {coupon.title}
              </h3>
              <p className="text-xs text-stone-500 font-normal mt-0.5">
                {coupon.subtitle}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              {coupon.isRedeemed ? (
                <div className="flex items-center space-x-1 text-emerald-600 font-semibold text-xs bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>REDEEMED</span>
                </div>
              ) : (
                <button
                  onClick={() => handleRedeem(coupon.id)}
                  className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-transform active:scale-95 shadow-sm"
                >
                  Redeem Ticket
                </button>
              )}

              <span className="text-[10px] text-stone-400 font-medium">+5 Hearts</span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {redeemedCoupon && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setRedeemedCoupon(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-apple-lg border border-stone-200"
            >
              <div className="text-4xl mb-2">{redeemedCoupon.emoji}</div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Coupon Claimed! 🎉
              </h3>
              <p className="text-xs text-stone-500 my-2 leading-relaxed">
                "{redeemedCoupon.title}" is officially logged and guaranteed for you!
              </p>

              <button
                onClick={() => setRedeemedCoupon(null)}
                className="mt-4 w-full py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
