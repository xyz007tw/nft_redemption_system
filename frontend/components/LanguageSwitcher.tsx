'use client';

import { Globe } from 'lucide-react';
import { useLanguage, Lang } from '@/lib/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const languages: { code: Lang; name: string }[] = [
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' },
    { code: 'vi-VN', name: 'Tiếng Việt' }
  ];

  return (
    <div className="relative group z-50">
      <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl transition-all border border-gray-700 h-10">
        <Globe size={18} className="text-gray-400" />
        <span className="text-sm font-medium">{languages.find(l => l.code === lang)?.name}</span>
      </button>
      
      {/* 下拉選單 */}
      <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-700 first:rounded-t-xl last:rounded-b-xl ${
              lang === l.code ? 'text-blue-400 font-bold' : 'text-gray-300'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>
    </div>
  );
}
