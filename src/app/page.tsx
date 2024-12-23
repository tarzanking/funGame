'use client';

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface LotteryResult {
  numbers: number[];
  timestamp: string;
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lotteryResults, setLotteryResults] = useState<LotteryResult[]>([]);

  // 烟花效果函数
  const fireworks = () => {
    const duration = 5000; // 延长持续时间
    const animationEnd = Date.now() + duration;
    
    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // 从底部发射的大型烟花
      confetti({
        particleCount: 100,
        startVelocity: 100,
        spread: 70,
        origin: { x: randomInRange(0.1, 0.9), y: 1 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
        ticks: 300,
        gravity: 1.2,
        scalar: 1.2,
        drift: 0
      });

      // 添加金色流星效果
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.9 },
        colors: ['#FFD700', '#FFA500'],
        ticks: 200,
        gravity: 1.5,
        scalar: 2,
        startVelocity: 80,
      });

      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.9 },
        colors: ['#FFD700', '#FFA500'],
        ticks: 200,
        gravity: 1.5,
        scalar: 2,
        startVelocity: 80,
      });

      // 添加闪光效果
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { x: randomInRange(0.3, 0.7), y: randomInRange(0.5, 0.7) },
          colors: ['#ffffff', '#f0f0f0'],
          ticks: 50,
          gravity: 0,
          scalar: 0.8,
          drift: 0,
          startVelocity: 30,
        });
      }, randomInRange(0, 1000));

    }, 250);

    // 最后的盛大finale
    setTimeout(() => {
      const end = Date.now() + 1000;
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

      (function frame() {
        confetti({
          particleCount: 200,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.8 },
          colors: colors,
          startVelocity: 50,
          ticks: 300
        });
        confetti({
          particleCount: 200,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.8 },
          colors: colors,
          startVelocity: 50,
          ticks: 300
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }, duration - 1000);
  };

  // 生成随机号码
  const generateNumbers = () => {
    const numbers = Array.from({ length: 6 }, () => 
      Math.floor(Math.random() * 49) + 1
    ).sort((a, b) => a - b);
    
    return {
      numbers,
      timestamp: new Date().toLocaleString('zh-CN')
    };
  };

  // 处理倒计时和开奖
  useEffect(() => {
    if (timeLeft > 0 && isDrawing) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isDrawing) {
      const newResult = generateNumbers();
      setLotteryResults(prev => [newResult, ...prev].slice(0, 10));
      fireworks(); // 触发烟花效果
      setTimeLeft(10);
    }
  }, [timeLeft, isDrawing]);

  // 数字翻转动画组件
  const NumberDisplay = ({ number }: { number: number }) => {
    return (
      <span 
        key={number}
        className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold
                   transform transition-all duration-500 hover:scale-110 animate-bounce"
      >
        {number}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        {/* 标题部分 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            幸运抽奖系统
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            公平、透明、可信赖的现代化抽奖平台
          </p>
          
          {/* 倒计时和开奖控制 */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 max-w-md mx-auto mb-8">
            <div className="text-6xl font-bold text-white mb-4 animate-pulse">
              {timeLeft}
            </div>
            <p className="text-white mb-4">距离下次开奖还有 {timeLeft} 秒</p>
            <button
              onClick={() => setIsDrawing(!isDrawing)}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
                isDrawing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isDrawing ? '停止开奖' : '开始开奖'}
            </button>
          </div>

          {/* 开奖记录 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">开奖记录</h2>
            <div className="space-y-4">
              {lotteryResults.map((result, index) => (
                <div 
                  key={index}
                  className={`bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center
                    ${index === 0 ? 'animate-fade-in-down' : ''}`}
                >
                  <div className="flex gap-2 mb-2 sm:mb-0">
                    {result.numbers.map((num, idx) => (
                      <NumberDisplay key={idx} number={num} />
                    ))}
                  </div>
                  <span className="text-white text-sm">
                    {result.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
