'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Minimize2, ChevronDown, MessageSquareText } from 'lucide-react';

const PREFILLED_QUESTIONS = [
  "WHY IS SHIPPING CHARGED SEPARATELY?",
  "HOW LONG DOES DELIVERY TAKE?",
  "HOW DOES THE SLOT FEE WORK?",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! Welcome to House of Avira. I'm the AI chatbot to help you find your perfect fit 💖" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const apiMessages = [...messages, userMessage];

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        let errMessage = 'Network response was not ok';
        try {
          const errData = await response.json();
          if (errData.error) errMessage = errData.error;
        } catch (e) {}
        throw new Error(errMessage);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunkValue = decoder.decode(value, { stream: !doneReading });
          assistantContent += chunkValue;
          
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = assistantContent;
            return newMessages;
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `I'm so sorry, I'm having a little trouble connecting right now. Please try again in a moment! 🤍 (Error: ${error.message})` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessageContent = (content) => {
    // Simple formatter to handle bolding, links, and basic line breaks without a heavy markdown parser
    let formatted = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; text-underline-offset: 2px; font-weight: 500;">$1</a>');
    formatted = formatted.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, '<a href="mailto:$1" style="text-decoration: underline; text-underline-offset: 2px; font-weight: 500;">$1</a>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: formatted.replace(/\n/g, '<br />') }} />;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-black text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center transition-transform duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="w-6 h-6 text-[#8A001A]" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-[100] w-[350px] max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <MessageSquareText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-perandory text-lg tracking-wide leading-none pt-1">Avira Assistant</h3>
              <p className="text-[9px] text-white/70 uppercase tracking-widest mt-0.5">AI Support</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-4 bg-[#FAFAFA] font-dm-sans">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-black text-white rounded-br-sm' 
                    : 'bg-white text-black border border-gray-100 rounded-bl-sm'
                }`}
              >
                {formatMessageContent(msg.content)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="self-start px-4 py-3 bg-white border border-gray-100 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prefilled Questions (Only show if user hasn't sent a message yet) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-5 pb-3 flex flex-col gap-2 bg-[#FAFAFA]">
            {PREFILLED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="text-left w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-medium text-gray-700 hover:text-black hover:border-black transition-colors shadow-sm tracking-wide"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 font-dm-sans">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="w-full pl-5 pr-12 py-3.5 bg-[#F5F5F7] border-none rounded-full text-[13.5px] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:bg-gray-400 transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
