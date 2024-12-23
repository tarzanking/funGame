'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Card {
  suit: string;
  value: string;
}

interface GameRecord {
  currentCard: Card;
  nextCard: Card;
  guess: 'higher' | 'lower';
  isCorrect: boolean;
  timestamp: string;
}

export default function CardsGame() {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [nextCard, setNextCard] = useState<Card | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [guess, setGuess] = useState<'higher' | 'lower' | null>(null);
  const [gameRecords, setGameRecords] = useState<GameRecord[]>([]);
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    winRate: 0
  });

  const suits = ['♠️', '♥️', '♣️', '♦️'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const getRandomCard = (): Card => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    return { suit, value };
  };

  const getCardValue = (value: string): number => {
    const valueMap: { [key: string]: number } = {
      'A': 1, 'J': 11, 'Q': 12, 'K': 13
    };
    return valueMap[value] || parseInt(value);
  };

  const makeGuess = (guessType: 'higher' | 'lower') => {
    if (!currentCard || isRevealed) return;
    
    setGuess(guessType);
    
    const newNextCard = getRandomCard();
    setNextCard(newNextCard);
    
    setTimeout(() => {
      setIsRevealed(true);
      
      const currentValue = getCardValue(currentCard.value);
      const nextValue = getCardValue(newNextCard.value);
      
      const isCorrect = 
        (guessType === 'higher' && nextValue > currentValue) ||
        (guessType === 'lower' && nextValue < currentValue);

      // 更新统计数据
      setStats(prev => {
        const newTotalGames = prev.totalGames + 1;
        const newWins = prev.wins + (isCorrect ? 1 : 0);
        return {
          totalGames: newTotalGames,
          wins: newWins,
          winRate: Math.round((newWins / newTotalGames) * 100)
        };
      });

      // 记录这一轮的游戏
      const newRecord: GameRecord = {
        currentCard,
        nextCard: newNextCard,
        guess: guessType,
        isCorrect,
        timestamp: new Date().toLocaleTimeString('zh-CN')
      };
      
      setGameRecords(prev => [newRecord, ...prev].slice(0, 10));

      if (isCorrect) {
        setStreak(prev => prev + 1);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setStreak(0);
      }
    }, 100);
    
    setTimeout(() => {
      setCurrentCard(newNextCard);
      setNextCard(null);
      setIsRevealed(false);
      setGuess(null);
    }, 3500);
  };

  // 显示单张卡牌的组件
  const CardDisplay = ({ 
    card, 
    size = 'large', 
    isFlipping = false,
    isNextCard = false
  }: { 
    card: Card, 
    size?: 'large' | 'small',
    isFlipping?: boolean,
    isNextCard?: boolean
  }) => {
    const sizeClasses = size === 'large' 
      ? 'w-48 h-72 text-6xl' 
      : 'w-20 h-32 text-2xl';

    return (
      <div className="perspective">
        <div className={`
          ${sizeClasses} 
          relative 
          transform-gpu 
          preserve-3d
          ${isNextCard ? (isFlipping ? 'flip-animation' : 'card-back') : ''}
        `}>
          {/* 卡牌正面 */}
          <div className={`
            ${sizeClasses}
            absolute 
            inset-0
            backface-hidden 
            bg-white 
            rounded-xl 
            flex 
            items-center 
            justify-center 
            shadow-lg
          `}>
            <div className={card.suit === '♥️' || card.suit === '♦️' ? 'text-red-500' : 'text-black'}>
              {card.suit}<br/>{card.value}
            </div>
          </div>
          
          {/* 卡牌背面 */}
          <div className={`
            ${sizeClasses}
            absolute 
            inset-0
            backface-hidden 
            rotate-y-180
            bg-gradient-to-br 
            from-purple-500 
            to-blue-500 
            rounded-xl 
            flex 
            items-center 
            justify-center
            shadow-lg
          `}>
            <div className="text-white text-opacity-20 text-4xl">
              ♠️♥️♣️♦️
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setCurrentCard(getRandomCard());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 max-w-md mx-auto mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.totalGames}</div>
                <div className="text-sm text-gray-300">总局数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.wins}</div>
                <div className="text-sm text-gray-300">获胜</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{stats.winRate}%</div>
                <div className="text-sm text-gray-300">胜率</div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            猜牌游戏
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            猜测下一张牌是大还是小
          </p>
          
          {/* 连胜记录 */}
          <div className="text-2xl text-white mb-8">
            当前连胜: <span className="font-bold text-yellow-300">{streak}</span>
          </div>

          {/* 游戏区域 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-2xl mx-auto mb-8">
            {/* 卡牌显示 */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {currentCard && (
                <div className="relative">
                  <CardDisplay 
                    card={currentCard}
                    isNextCard={false}
                  />
                  <div className="text-white mt-2">当前牌</div>
                </div>
              )}
              {nextCard && (
                <div className="relative animate-fade-in">
                  <CardDisplay 
                    card={nextCard} 
                    isFlipping={isRevealed}
                    isNextCard={true}
                  />
                  <div className="text-white mt-2">下一张</div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => makeGuess('higher')}
                disabled={isRevealed}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  isRevealed 
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                } text-white`}
              >
                更大
              </button>
              <button
                onClick={() => makeGuess('lower')}
                disabled={isRevealed}
                className={`px-8 py-4 rounded-full font-bold transition-all duration-300 ${
                  isRevealed 
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-red-500 hover:bg-red-600 hover:scale-105'
                } text-white`}
              >
                更小
              </button>
            </div>
          </div>

          {/* 游戏记录 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">游戏记录</h2>
            <div className="space-y-4">
              {gameRecords.map((record, index) => (
                <div 
                  key={index}
                  className={`bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between
                    ${index === 0 ? 'animate-fade-in-down' : ''}`}
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <CardDisplay card={record.currentCard} size="small" />
                    <div className="text-white text-2xl">
                      {record.guess === 'higher' ? '→' : '←'}
                    </div>
                    <CardDisplay card={record.nextCard} size="small" />
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <span className={`text-lg font-bold mb-1 ${
                      record.isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {record.isCorrect ? '猜对了！' : '猜错了'}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {record.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 