import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, RefreshCw, CheckCircle2, XCircle, Award } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  icon: string;
  points: number;
}

interface GamesSectionProps {
  onAddHearts: (count: number) => void;
}

export const GamesSection: React.FC<GamesSectionProps> = ({ onAddHearts }) => {
  const [activeGameTab, setActiveGameTab] = useState<'catch' | 'quiz'>('catch');

  // CATCH GAME
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [basketX, setBasketX] = useState<number>(50);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // QUIZ
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const quizQuestions = [
    {
      question: "Which date in July is officially declared the Cutest Day Ever?",
      options: ["July 1st", "July 27th (Her Birthday! 🎂)", "July 14th", "July 30th"],
      correct: 1,
      explanation: "Correct! July 27th is 100% legendary!",
    },
    {
      question: "What is her superpower ability?",
      options: [
        "Flying in the clouds",
        "Making anyone smile effortlessly ✨",
        "Reading minds",
        "Sleeping 24 hours straight",
      ],
      correct: 1,
      explanation: "A true master of spreading warmth!",
    },
    {
      question: "What happens when she enters a room?",
      options: [
        "It gets instantly brighter & warmer 🌟",
        "Lights flicker",
        "Nothing really",
        "Sirens go off",
      ],
      correct: 0,
      explanation: "Factually proven!",
    },
    {
      question: "How many birthday hugs is she entitled to receive today?",
      options: ["1 Hug", "5 Hugs", "Unlimited Hugs 🫂", "Zero"],
      correct: 2,
      explanation: "Unlimited & infinite!",
    },
  ];

  // GAME LOOP
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('ended');
          sounds.playUnlockSuccess();
          if (score > highScore) setHighScore(score);
          onAddHearts(Math.floor(score / 2));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, score, highScore]);

  // SPAWN FALLING ITEMS
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const icons = ['💖', '🎂', '✨', '🌸', '🎁', '⭐'];
      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85 + 5,
        y: -10,
        speed: Math.random() * 2.2 + 2.2,
        icon: icons[Math.floor(Math.random() * icons.length)],
        points: 1,
      };
      setFallingItems((prev) => [...prev, newItem]);
    }, 500);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  // ANIMATION & COLLISION
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animFrame = requestAnimationFrame(() => {
      setFallingItems((prevItems) =>
        prevItems
          .map((item) => ({ ...item, y: item.y + item.speed }))
          .filter((item) => {
            if (item.y >= 75 && item.y <= 88) {
              const distance = Math.abs(item.x - basketX);
              if (distance < 12) {
                sounds.playCatch();
                setScore((s) => s + item.points);
                return false;
              }
            }
            return item.y < 100;
          })
      );
    });

    return () => cancelAnimationFrame(animFrame);
  }, [fallingItems, gameState, basketX]);

  const handlePointerMove = (clientX: number) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, relativeX)));
  };

  const startCatchGame = () => {
    sounds.playClick();
    setScore(0);
    setTimeLeft(20);
    setFallingItems([]);
    setGameState('playing');
  };

  const handleAnswerQuiz = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    const q = quizQuestions[currentQuizIdx];

    if (optIdx === q.correct) {
      sounds.playCatch();
      setQuizScore((prev) => prev + 1);
      onAddHearts(2);
    } else {
      sounds.playError();
    }

    setTimeout(() => {
      if (currentQuizIdx < quizQuestions.length - 1) {
        setCurrentQuizIdx((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        setQuizFinished(true);
        sounds.playUnlockSuccess();
      }
    }, 1000);
  };

  const resetQuiz = () => {
    sounds.playClick();
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="apple-card p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-6">
          <div>
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-1">
              Arcade Section
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
              Interactive Arcade
            </h2>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-full border border-stone-200">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGameTab('catch');
              }}
              className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                activeGameTab === 'catch' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Catch Sprinkles
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveGameTab('quiz');
              }}
              className={`px-4 py-1.5 rounded-full font-medium text-xs transition-colors ${
                activeGameTab === 'quiz' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Birthday Quiz
            </button>
          </div>
        </div>

        {/* GAME 1 */}
        {activeGameTab === 'catch' && (
          <div className="text-center">
            {gameState === 'idle' && (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 bg-stone-100 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl border border-stone-200 shadow-sm">
                  💖
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Catch Falling Birthday Sprinkles
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Move your basket across the screen to catch falling items in 20 seconds!
                </p>
                {highScore > 0 && (
                  <div className="inline-flex items-center space-x-1.5 bg-stone-100 text-stone-800 text-xs px-3 py-1 rounded-full font-medium">
                    <Trophy className="w-3.5 h-3.5 text-stone-600" />
                    <span>High Score: {highScore} Points</span>
                  </div>
                )}
                <div>
                  <button
                    onClick={startCatchGame}
                    className="bg-stone-900 hover:bg-black text-white font-medium text-xs px-6 py-2.5 rounded-full shadow-apple-sm transition-transform active:scale-95"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}

            {gameState === 'playing' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-stone-900 text-white px-4 py-2 rounded-2xl text-xs font-medium">
                  <span>Score: {score} 💖</span>
                  <span>Time: {timeLeft}s</span>
                </div>

                <div
                  ref={gameAreaRef}
                  onMouseMove={(e) => handlePointerMove(e.clientX)}
                  onTouchMove={(e) => {
                    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
                  }}
                  className="relative w-full h-[300px] bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden cursor-crosshair touch-none"
                >
                  {fallingItems.map((item) => (
                    <div
                      key={item.id}
                      className="absolute text-xl select-none"
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {item.icon}
                    </div>
                  ))}

                  <div
                    className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
                    style={{ left: `${basketX}%` }}
                  >
                    <div className="w-16 h-7 bg-stone-800 rounded-b-xl border border-stone-600 shadow-md flex items-center justify-center text-white font-medium text-[11px]">
                      🧺 Catch
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState === 'ended' && (
              <div className="py-8 space-y-4">
                <Trophy className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="font-serif text-2xl font-semibold text-stone-900">Game Over</h3>
                <p className="text-sm font-medium text-stone-600">
                  You caught <span className="font-semibold text-stone-900">{score}</span> items!
                </p>

                <button
                  onClick={startCatchGame}
                  className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-5 py-2 rounded-full inline-flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME 2 */}
        {activeGameTab === 'quiz' && (
          <div className="space-y-6">
            {!quizFinished ? (
              <div className="space-y-4 max-w-md mx-auto text-left">
                <div className="flex justify-between items-center text-xs font-medium text-stone-400">
                  <span>Question {currentQuizIdx + 1} of {quizQuestions.length}</span>
                  <span>Score: {quizScore}</span>
                </div>

                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200/80">
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    {quizQuestions[currentQuizIdx].question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {quizQuestions[currentQuizIdx].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === quizQuestions[currentQuizIdx].correct;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerQuiz(idx)}
                        disabled={selectedOption !== null}
                        className={`p-3.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                          selectedOption !== null
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                              : isSelected
                              ? 'bg-rose-50 border-rose-300 text-rose-900'
                              : 'bg-white border-stone-200 opacity-50'
                            : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3 max-w-xs mx-auto">
                <Award className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="font-serif text-xl font-semibold text-stone-900">Quiz Completed</h3>
                <p className="text-xs text-stone-500">
                  You scored <span className="font-semibold text-stone-900">{quizScore} / {quizQuestions.length}</span>!
                </p>

                <button
                  onClick={resetQuiz}
                  className="bg-stone-900 text-white text-xs font-semibold px-5 py-2 rounded-full inline-flex items-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
