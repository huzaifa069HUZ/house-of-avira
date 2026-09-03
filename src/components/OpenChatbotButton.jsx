'use client';

import React from 'react';
import { useChatbotStore } from '@/store/chatbotStore';

export default function OpenChatbotButton() {
  const openChatbot = useChatbotStore(state => state.openChatbot);

  return (
    <button 
      onClick={openChatbot} 
      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-[#8A001A] hover:shadow-sm transition-all group w-full h-full bg-white"
    >
      <span className="text-xs font-bold tracking-wider uppercase text-gray-600 group-hover:text-[#8A001A] font-dm-sans">
        Ask Avira AI
      </span>
    </button>
  );
}
