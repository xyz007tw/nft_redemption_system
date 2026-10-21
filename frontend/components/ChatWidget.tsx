'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleJumpToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    serviceTab?: 'shoppable' | 'livegood' | 'free365'
  ) => {
    setMobileMenuOpen(false);
    setIsOpen(false);
    if (typeof window === 'undefined') return;

    if (serviceTab) {
      window.dispatchEvent(new CustomEvent('weixiang-switch-service-tab', { detail: { tab: serviceTab } }));
    }

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `/#${sectionId}`);
    } else if (serviceTab) {
      window.location.href = `/#${sectionId}?tab=${serviceTab}`;
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
      {/* 1. 電腦版 (md 以上) 維持右下角懸浮按鈕堆疊 (AI客製服務 + AI頂配教材 + AI客服) */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-2.5">
        {/* AI 客製服務 Floating Pill + 懸浮子選單 (位於 AI 頂配教材正上方) */}
        {!isOpen && (
          <div className="relative group flex flex-col items-end">
            {/* 懸浮展開之三服務快速跳轉氣泡 */}
            <div className="mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col items-end gap-1.5 pointer-events-none group-hover:pointer-events-auto">
              <a
                href="/#video-shoppable-service"
                onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'shoppable')}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/95 hover:bg-sky-600 text-sky-200 hover:text-white border border-sky-400/60 text-xs font-extrabold shadow-lg whitespace-nowrap transition-all"
              >
                {lang === 'zh-TW' ? '🛒 01｜AI影片導購系統' :
                 lang === 'zh-CN' ? '🛒 01｜AI影片导购系统' :
                 lang === 'ja-JP' ? '🛒 01｜AI動画コマース構築' :
                 lang === 'ko-KR' ? '🛒 01｜AI 영상 쇼핑 시스템' :
                 lang === 'vi-VN' ? '🛒 01｜Video Mua sắm AI' :
                 '🛒 01 | AI Video Shoppable'}
              </a>
              <a
                href="/#video-shoppable-service"
                onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'livegood')}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/95 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-400/60 text-xs font-extrabold shadow-lg whitespace-nowrap transition-all"
              >
                {lang === 'zh-TW' ? '⚡ 02｜LiveGood 協辦與 AI協播' :
                 lang === 'zh-CN' ? '⚡ 02｜LiveGood 协办与 AI协播' :
                 lang === 'ja-JP' ? '⚡ 02｜LiveGood 代行＆AI協播' :
                 lang === 'ko-KR' ? '⚡ 02｜LiveGood 대행 & AI홍보' :
                 lang === 'vi-VN' ? '⚡ 02｜LiveGood & AI Tự động' :
                 '⚡ 02 | LiveGood & AI Co-Broadcast'}
              </a>
              <a
                href="/#video-shoppable-service"
                onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'free365')}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/95 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-400/60 text-xs font-extrabold shadow-lg whitespace-nowrap transition-all"
              >
                {lang === 'zh-TW' ? '🚀 03｜AI尋客365天免錢 ($660)' :
                 lang === 'zh-CN' ? '🚀 03｜AI寻客365天免钱 ($660)' :
                 lang === 'ja-JP' ? '🚀 03｜AI集客365日無料 ($660)' :
                 lang === 'ko-KR' ? '🚀 03｜AI 모객 365일 무료 ($660)' :
                 lang === 'vi-VN' ? '🚀 03｜AI Tìm Khách 365 Ngày ($660)' :
                 '🚀 03 | AI 365-Day Free Plan ($660)'}
              </a>
            </div>

            <a
              href="/#video-shoppable-service"
              onClick={(e) => handleJumpToSection(e, 'video-shoppable-service')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-black px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(56,189,248,0.6)] border border-white/40 hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
            >
              <span className="text-base">🛠️</span>
              <span>
                {lang === 'zh-TW' ? 'AI客製服務' :
                 lang === 'zh-CN' ? 'AI客制服务' :
                 lang === 'ja-JP' ? 'AIカスタム開発' :
                 lang === 'ko-KR' ? 'AI 맞춤 서비스' :
                 lang === 'vi-VN' ? 'Dịch vụ AI Tùy chỉnh' :
                 'AI Custom Services'}
              </span>
            </a>
          </div>
        )}

        {/* AI 頂配教材 Floating Pill (位於 AI 客服正上方) */}
        {!isOpen && (
          <a
            href="/#tutor-courses"
            onClick={(e) => handleJumpToSection(e, 'tutor-courses')}
            className="group flex items-center gap-2 bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black font-black px-4 py-2.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-white/40 hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
          >
            <span className="text-base">🎓</span>
            <span>
              {lang === 'zh-TW' ? 'AI頂配教材' :
               lang === 'zh-CN' ? 'AI顶配教材' :
               lang === 'ja-JP' ? 'AIマスター教材' :
               lang === 'ko-KR' ? 'AI 마스터 교재' :
               lang === 'vi-VN' ? 'Giáo trình AI' :
               'AI Master Courses'}
            </span>
          </a>
        )}

        {/* AI 客服按鈕與氣泡 */}
        <div className="flex items-center gap-4">
          {/* Animated Tooltip Bubble */}
          {!isOpen && (
            <div className="relative animate-bounce">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)] font-bold text-sm whitespace-nowrap border border-white/20">
                {lang === 'en-US' ? 'Chat with us ✨' :
                 lang === 'ja-JP' ? 'チャットする ✨' :
                 lang === 'ko-KR' ? '채팅하기 ✨' :
                 lang === 'vi-VN' ? 'Trò chuyện ✨' :
                 lang === 'zh-CN' ? '欢迎聊聊 ✨' :
                 '歡迎聊聊 ✨'}
              </div>
              {/* Arrow pointing right */}
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-rose-500"></div>
            </div>
          )}

          <button
            onClick={toggleChat}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:scale-110 transition-transform shrink-0"
          >
            {isOpen ? (
              <span className="text-2xl font-bold">×</span>
            ) : (
              <span className="text-2xl">💬</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. 手機版 (md 以下) 專屬「底部橫向置底快捷列 (Bottom Bar)」：完全不遮擋右側主畫面閱讀空間 */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* 若點擊「AI客製」展開上方三合一快選抽屜 */}
        {mobileMenuOpen && !isOpen && (
          <div className="mx-3 mb-2 p-2.5 rounded-2xl bg-slate-950/95 border border-sky-400/50 shadow-[0_-8px_30px_rgba(0,0,0,0.75)] backdrop-blur-xl flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2 pb-1 border-b border-white/10">
              <span className="text-[11px] font-black text-sky-300">
                {lang.includes('zh') ? '🛠️ 選擇欲前往的 AI 客製與協辦方案：' : '🛠️ Select AI Custom / Concierge Plan:'}
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-400 hover:text-white font-bold px-1.5"
              >
                ✕
              </button>
            </div>
            <a
              href="/#video-shoppable-service"
              onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'shoppable')}
              className="px-3 py-2 rounded-xl bg-sky-950/80 hover:bg-sky-600 text-sky-200 border border-sky-400/40 text-xs font-extrabold flex items-center justify-between"
            >
              <span>{lang.includes('zh') ? '🛒 01｜AI影片導購系統' : '🛒 01 | AI Video Shoppable'}</span>
              <span className="text-amber-300 font-black">$300 起 →</span>
            </a>
            <a
              href="/#video-shoppable-service"
              onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'livegood')}
              className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-600 text-purple-200 border border-purple-400/40 text-xs font-extrabold flex items-center justify-between"
            >
              <span>{lang.includes('zh') ? '⚡ 02｜LiveGood 協辦與 AI協播' : '⚡ 02 | LiveGood & AI'}</span>
              <span className="text-amber-300 font-black">$139.95 / $180 →</span>
            </a>
            <a
              href="/#video-shoppable-service"
              onClick={(e) => handleJumpToSection(e, 'video-shoppable-service', 'free365')}
              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-600 text-emerald-200 border border-emerald-400/40 text-xs font-extrabold flex items-center justify-between"
            >
              <span>{lang.includes('zh') ? '🚀 03｜AI尋客365天免錢' : '🚀 03 | AI 365-Day Free'}</span>
              <span className="text-amber-300 font-black">$660 USD →</span>
            </a>
          </div>
        )}

        {/* 底部橫向三合一導覽列 */}
        <div className="bg-slate-950/95 backdrop-blur-xl border-t border-white/15 px-2.5 py-2 shadow-[0_-4px_25px_rgba(0,0,0,0.65)] grid grid-cols-3 gap-2">
          {/* 左：AI 頂配教材 */}
          <a
            href="/#tutor-courses"
            onClick={(e) => handleJumpToSection(e, 'tutor-courses')}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md whitespace-nowrap"
          >
            <span>🎓</span>
            <span>
              {lang === 'zh-TW' ? 'AI頂配教材' :
               lang === 'zh-CN' ? 'AI顶配教材' :
               lang === 'ja-JP' ? 'AI教材' :
               lang === 'ko-KR' ? 'AI교재' :
               lang === 'vi-VN' ? 'Giáo trình' :
               'AI Courses'}
            </span>
          </a>

          {/* 中：AI 客製服務 (點擊展開/收合 01/02/03 選單並可跳轉) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setMobileMenuOpen((prev) => !prev);
            }}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-black text-xs shadow-md border border-white/25 whitespace-nowrap"
          >
            <span>🛠️</span>
            <span>
              {lang === 'zh-TW' ? 'AI客製服務' :
               lang === 'zh-CN' ? 'AI客制服务' :
               lang === 'ja-JP' ? 'AIカスタム' :
               lang === 'ko-KR' ? 'AI맞춤' :
               lang === 'vi-VN' ? 'Dịch vụ AI' :
               'AI Services'}
            </span>
            <span className="text-[10px] opacity-90">{mobileMenuOpen ? '▼' : '▲'}</span>
          </button>

          {/* 右：AI 客服聊聊 */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              toggleChat();
            }}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-black text-xs shadow-md border border-white/25 whitespace-nowrap"
          >
            <span>{isOpen ? '✕' : '💬'}</span>
            <span>
              {isOpen
                ? (lang.includes('zh') ? '關閉客服' : 'Close')
                : lang === 'en-US' ? 'AI Chat ✨' :
                  lang === 'ja-JP' ? 'AI相談 ✨' :
                  lang === 'ko-KR' ? 'AI상담 ✨' :
                  lang === 'vi-VN' ? 'Tư vấn ✨' :
                  lang === 'zh-CN' ? 'AI客服 ✨' :
                  'AI客服 ✨'}
            </span>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-3 left-3 sm:left-auto sm:bottom-24 sm:right-6 sm:w-96 h-[460px] sm:h-[500px] bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-xl">
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
