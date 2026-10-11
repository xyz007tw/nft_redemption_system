'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const welcomeMessage = lang === 'zh-TW' ? '您好！我是微享 AI 專屬客服，請問有什麼我可以協助您的？（支援多國語言）' :
                         lang === 'zh-CN' ? '您好！我是微享 AI 专属客服，请问有什么我可以协助您的？（支援多国语言）' :
                         lang === 'en-US' ? 'Hello! I am the WeiXiang AI Assistant. How can I help you today?' :
                         lang === 'ja-JP' ? 'こんにちは！WeiXiang AIアシスタントです。何かお手伝いできることはありますか？' :
                         lang === 'ko-KR' ? '안녕하세요! WeiXiang AI 어시스턴트입니다. 무엇을 도와드릴까요?' :
                         'Xin chào! Tôi là Trợ lý AI WeiXiang. Tôi có thể giúp gì cho bạn?';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (messages.length === 0) {
        setMessages([{ role: 'ai', content: welcomeMessage }]);
      }
      const query = e?.detail?.query;
      if (query) {
        setInput(query);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, [messages, welcomeMessage]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'ai', content: welcomeMessage }]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: messages, language: lang })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: '⚠️ 系統繁忙中，請稍後再試。 (System busy, please try again later.)' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button and Tooltip Container */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">
        {/* Animated Tooltip Bubble */}
        {!isOpen && (
          <div className="relative animate-bounce">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)] font-bold text-sm whitespace-nowrap border border-white/20">
              {lang === 'en-US' ? 'Chat with us ✨' :
               lang === 'ja-JP' ? 'チャットする ✨' :
               lang === 'ko-KR' ? '채팅하기 ✨' :
               lang === 'vi-VN' ? 'Trò chuyện ✨' :
               '歡迎聊聊 ✨'}
            </div>
            {/* Arrow pointing right */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-rose-500"></div>
          </div>
        )}

        <button
          onClick={toggleChat}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform"
        >
          {isOpen ? (
            <span className="text-2xl font-bold">×</span>
          ) : (
            <span className="text-2xl">💬</span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
            <h3 className="text-white font-bold flex items-center gap-2">
              <span className="animate-pulse">🤖</span> WeiXiang AI Agent
            </h3>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white/5 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white p-2 rounded-xl transition-colors"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
