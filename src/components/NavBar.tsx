'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <div className="bg-white/10 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 py-4">
          <Link 
            href="/"
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
              pathname === '/' 
                ? 'bg-purple-600 text-white' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            幸运抽奖
          </Link>
          <Link 
            href="/cards"
            className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${
              pathname === '/cards' 
                ? 'bg-purple-600 text-white' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            猜牌游戏
          </Link>
        </div>
      </div>
    </div>
  );
} 