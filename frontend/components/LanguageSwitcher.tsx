'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage, Lang } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Lang; name: string }[] = [
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'vi-VN', name: 'Tiếng Việt' }
  ];

  // 點擊選單外部時自動收合
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative group z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-1.5 bg-gray-800 hover:bg-gray-700 active:scale-[0.98] px-3 py-1.5 md:px-4 md:py-2 rounded-xl transition-all border border-gray-700 h-9 md:h-10 cursor-pointer"
      >
        <Globe size={16} className="text-emerald-400 shrink-0" />
        <span className="text-xs md:text-sm font-bold text-white whitespace-nowrap">
          {languages.find((l) => l.code === lang)?.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* 下拉選單：同時支援手機點擊 (open state) 與電腦滑鼠懸停 (md:group-hover) */}
      <div
        className={`absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-200 overflow-hidden z-[60] ${
          open
            ? 'opacity-100 visible translate-y-0 pointer-events-auto'
            : 'opacity-0 invisible -translate-y-1 pointer-events-none md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 md:group-hover:pointer-events-auto'
        }`}
      >
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 text-xs md:text-sm hover:bg-slate-800 active:bg-slate-700 transition-colors flex items-center justify-between cursor-pointer ${
              lang === l.code ? 'text-emerald-400 font-black bg-emerald-500/10' : 'text-gray-200 font-medium'
            }`}
          >
            <span>{l.name}</span>
            {lang === l.code && <span className="text-xs">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
