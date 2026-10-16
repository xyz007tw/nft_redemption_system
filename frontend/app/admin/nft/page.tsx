'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { WEIXIANG_NFT_ABI, WEIXIANG_NFT_ADDRESS } from '@/lib/contractAbi';
import { parseUnits } from 'viem';

const DEFAULT_PROMO_TEMPLATE_ZH = `<div class="space-y-6 text-left">
  <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border border-emerald-400/40">
    <h3 class="text-2xl font-black text-emerald-300 mb-2">🚀 為什麼您必須掌握這套「AI頂配教材」？</h3>
    <p class="text-gray-200 leading-relaxed">
      告別傳統高昂廣告費與人工剪輯！本套教材完整公開微享 AI 自動來客系統的核心實戰配置，手把手帶您從零建立 24 小時全自動運轉的獲客與變現機器。
    </p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-emerald-400 font-bold mb-1">📌 實戰重點 01</div>
      <div class="text-white font-bold text-lg mb-2">AI 爆款影音與圖文自動產線</div>
      <p class="text-gray-400 text-sm">掌握 AI 腳本、多語系配音與高轉化圖卡，單人即可抵一個 10 人行銷團隊。</p>
    </div>
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-cyan-400 font-bold mb-1">📌 實戰重點 02</div>
      <div class="text-white font-bold text-lg mb-2">跨國多語系 SEO 流量矩陣</div>
      <p class="text-gray-400 text-sm">自動生成中、英、日、韓、越長文並排程發佈，精準攔截全球搜尋引擎自然流量。</p>
    </div>
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-amber-400 font-bold mb-1">📌 實戰重點 03</div>
      <div class="text-white font-bold text-lg mb-2">自動收單發貨 ＋ 25% 裂變分潤</div>
      <p class="text-gray-400 text-sm">串接信用卡與 USDT 收款，付費秒級發貨並啟動 25% 聯盟分潤倍增業績！</p>
    </div>
  </div>
</div>`;

const DEFAULT_PROMO_TEMPLATE_EN = `<div class="space-y-6 text-left">
  <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border border-emerald-400/40">
    <h3 class="text-2xl font-black text-emerald-300 mb-2">🚀 Why Master This AI Practical Blueprint?</h3>
    <p class="text-gray-200 leading-relaxed">
      Stop burning budget on expensive ads and manual editing! This complete AI Master Material reveals the exact SOPs to build a 24/7 automated client-acquisition and monetization engine.
    </p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-emerald-400 font-bold mb-1">📌 Pillar 01</div>
      <div class="text-white font-bold text-lg mb-2">Automated AI Video & Infographic Matrix</div>
      <p class="text-gray-400 text-sm">Generate scripts, multilingual voiceovers, and viral infographics automatically.</p>
    </div>
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-cyan-400 font-bold mb-1">📌 Pillar 02</div>
      <div class="text-white font-bold text-lg mb-2">Global Multilingual SEO Engine</div>
      <p class="text-gray-400 text-sm">Deploy localized long-form articles across 6+ languages to capture organic search traffic.</p>
    </div>
    <div class="p-5 rounded-xl bg-black/50 border border-white/10">
      <div class="text-amber-400 font-bold mb-1">📌 Pillar 03</div>
      <div class="text-white font-bold text-lg mb-2">Auto-Fulfillment & 25% Viral Affiliate</div>
      <p class="text-gray-400 text-sm">Accept Credit Cards & USDT with instant delivery and a 25% viral referral loop.</p>
    </div>
  </div>
</div>`;

function toYoutubeEmbed(rawUrl: string): string {
  const url = rawUrl.trim();
  if (url.includes('youtube.com/embed/')) return url;
  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  return url;
}

export default function AdminNFTPage() {
  const { isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New package form state
  const [newPkgId, setNewPkgId] = useState('');
  const [newNameZh, setNewNameZh] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newPrice, setNewPrice] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newProductType, setNewProductType] = useState('DIRECT_COURSE');
  const [newCourseLink, setNewCourseLink] = useState('');
  const [newPromoHtmlZh, setNewPromoHtmlZh] = useState('');
  const [newPromoHtmlEn, setNewPromoHtmlEn] = useState('');
  const [showNewPromoEditor, setShowNewPromoEditor] = useState(false);

  // Existing package HTML editor state
  const [editingPkgId, setEditingPkgId] = useState<number | null>(null);
  const [activeHtmlLang, setActiveHtmlLang] = useState<'zh' | 'en'>('zh');
  const [showLivePreview, setShowLivePreview] = useState(true);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/packages');
      const data = await res.json();
      if (data.success) {
        setPackages(data.packages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSaveFrontend = async (pkgId: number | string, isNew = false) => {
    try {
      let payload;
      if (isNew) {
        payload = {
          id: newPkgId,
          name_zh: newNameZh,
          name_en: newNameEn || newNameZh,
          amount: newAmount,
          price: newPrice,
          discount_text: newDiscount,
          product_type: newProductType,
          course_link: newCourseLink || null,
          promo_html_zh: newPromoHtmlZh || null,
          promo_html_en: newPromoHtmlEn || null
        };
      } else {
        const pkg = packages.find(p => p.id === pkgId);
        payload = pkg;
      }

      const res = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        alert("✅ 資料庫更新成功！前台教材宣傳文案 HTML 與下載連結已同步生效！");
        fetchPackages();
        if (isNew) {
          setNewPkgId('');
          setNewNameZh('');
          setNewNameEn('');
          setNewPrice('');
          setNewDiscount('');
          setNewCourseLink('');
          setNewPromoHtmlZh('');
          setNewPromoHtmlEn('');
          setShowNewPromoEditor(false);
        }
      } else {
        alert("更新失敗: " + data.error);
      }
    } catch (e: any) {
      alert("系統異常: " + e.message);
    }
  };

  const handleUpdateSmartContract = async (pkg: any) => {
    if (!pkg.price) return alert("沒有價格");
    const priceInWei = parseUnits(pkg.price.toString(), 6);
    
    writeContract({
      address: WEIXIANG_NFT_ADDRESS as `0x${string}`,
      abi: WEIXIANG_NFT_ABI,
      functionName: 'setPackage',
      args: [BigInt(pkg.id), BigInt(1), BigInt(pkg.amount), priceInWei, true],
    }, {
      onSuccess: () => alert("已送出至區塊鏈！"),
      onError: (err) => alert("失敗: " + (err.message || "未知錯誤"))
    });
  };

  const editingPkgIndex = packages.findIndex(p => p.id === editingPkgId);
  const editingPkg = editingPkgIndex >= 0 ? packages[editingPkgIndex] : null;

  const updateEditingHtml = (htmlValue: string) => {
    if (editingPkgIndex < 0) return;
    const newPkgs = [...packages];
    if (activeHtmlLang === 'zh') {
      newPkgs[editingPkgIndex].promo_html_zh = htmlValue;
    } else {
      newPkgs[editingPkgIndex].promo_html_en = htmlValue;
    }
    setPackages(newPkgs);
  };

  const currentEditingHtml = editingPkg
    ? (activeHtmlLang === 'zh' ? (editingPkg.promo_html_zh || '') : (editingPkg.promo_html_en || ''))
    : '';

  const insertSnippetToEditor = (snippet: string, isForNewForm = false) => {
    if (isForNewForm) {
      if (activeHtmlLang === 'zh') {
        setNewPromoHtmlZh(prev => (prev ? prev + '\n' + snippet : snippet));
      } else {
        setNewPromoHtmlEn(prev => (prev ? prev + '\n' + snippet : snippet));
      }
    } else {
      updateEditingHtml(currentEditingHtml ? currentEditingHtml + '\n' + snippet : snippet);
    }
  };

  const handleInsertImage = (isForNewForm = false) => {
    const imgUrl = prompt('請輸入宣傳圖片或海報網址 (例如 /sponsor-zh.jpg 或 https://...)：');
    if (!imgUrl) return;
    const snippet = `<div class="my-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">\n  <img src="${imgUrl.trim()}" alt="Course Promo" class="w-full h-auto object-cover" />\n</div>`;
    insertSnippetToEditor(snippet, isForNewForm);
  };

  const handleInsertVideo = (isForNewForm = false) => {
    const ytUrl = prompt('請輸入 YouTube 影片網址 (支援 youtu.be / watch?v= / shorts)：');
    if (!ytUrl) return;
    const embedUrl = toYoutubeEmbed(ytUrl);
    const snippet = `<div class="my-6 w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]">\n  <iframe width="100%" height="100%" src="${embedUrl}" title="Course Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full"></iframe>\n</div>`;
    insertSnippetToEditor(snippet, isForNewForm);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">NFT 與 AI頂配教材管理中心</h1>
      <p className="text-gray-400 mb-8">
        此區塊可讓您隨時新增或修改「一般節點眾籌」、「🎓 AI頂配教材 (含宣傳文案 HTML、自動下載與電郵轉發連結)」或「創作者斗內贊助」。<br />
        <span className="text-emerald-400 font-semibold">💡 提示：一般眾籌與「🎓 AI頂配教材 (DIRECT_COURSE)」皆會自動納入 25% 聯盟推廣分潤；僅「斗內贊助 (SPONSOR)」不計入分潤。</span>
      </p>

      {/* 新增方案表單 */}
      <div className="bg-gray-800 p-6 rounded-xl mb-8 border border-green-500/30">
        <h2 className="text-xl font-bold mb-4 text-green-400">➕ 新增眾籌項目 / AI頂配教材</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input type="number" placeholder="方案 ID (例如: 6)" value={newPkgId} onChange={e => setNewPkgId(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="中文名稱 (教材或方案名)" value={newNameZh} onChange={e => setNewNameZh(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="英文名稱 (English Name)" value={newNameEn} onChange={e => setNewNameEn(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="發行數量 / 份數 (預設 1)" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="number" placeholder="售價 (USDT)" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <input type="text" placeholder="折扣/亮點文字 (例如: 限時特惠)" value={newDiscount} onChange={e => setNewDiscount(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white" />
          <select value={newProductType} onChange={e => setNewProductType(e.target.value)} className="bg-black border border-gray-700 rounded px-3 py-2 text-white font-semibold">
            <option value="NFT_REDEEM">一般節點眾籌 (享25%分潤)</option>
            <option value="DIRECT_COURSE">🎓 AI頂配教材 (享25%分潤+教材發貨)</option>
            <option value="SPONSOR">創作者贊助 (純斗內・無分潤)</option>
          </select>
          <input
            type="text"
            placeholder="📥 教材下載/觀看連結 (course_link)"
            value={newCourseLink}
            onChange={e => setNewCourseLink(e.target.value)}
            className="bg-black border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 placeholder-gray-500"
          />
        </div>

        {/* 新增表單內的宣傳文案 HTML 摺疊編輯器 */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowNewPromoEditor(!showNewPromoEditor)}
            className="px-4 py-2 bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-500/40 rounded-lg text-xs font-bold text-emerald-300 cursor-pointer flex items-center gap-2"
          >
            <span>🎨</span>
            {showNewPromoEditor ? '收合「教材宣傳文案 HTML 編輯器」▲' : '展開編寫「教材宣傳文案 HTML 碼 (含一鍵銷售範本)」▼'}
          </button>

          {showNewPromoEditor && (
            <div className="mt-4 p-5 bg-gray-900 border border-emerald-500/30 rounded-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveHtmlLang('zh')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeHtmlLang === 'zh' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    🇹🇼 中文宣傳 HTML
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHtmlLang('en')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeHtmlLang === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                  >
                    🇺🇸 英文宣傳 HTML
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => insertSnippetToEditor(activeHtmlLang === 'zh' ? DEFAULT_PROMO_TEMPLATE_ZH : DEFAULT_PROMO_TEMPLATE_EN, true)}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    ✨ 插入爆款銷售模板
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertImage(true)}
                    className="px-3 py-1.5 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    🖼️ 插入宣傳海報/圖片
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertVideo(true)}
                    className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    🎬 插入 YouTube 影片
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                value={activeHtmlLang === 'zh' ? newPromoHtmlZh : newPromoHtmlEn}
                onChange={e => activeHtmlLang === 'zh' ? setNewPromoHtmlZh(e.target.value) : setNewPromoHtmlEn(e.target.value)}
                placeholder={activeHtmlLang === 'zh' ? '在此貼上或編寫中文宣傳文案 HTML 碼（支援 Tailwind class、圖片、影片、文字排版）...' : 'Paste or write English promotional HTML here...'}
                className="w-full bg-black border border-gray-700 rounded-xl p-4 font-mono text-xs text-emerald-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <button onClick={() => handleSaveFrontend(0, true)} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold w-full md:w-auto cursor-pointer">
          ➕ 新增至前台資料庫
        </button>
      </div>

      {/* 現有方案列表 */}
      <div className="bg-gray-800 p-6 rounded-xl border border-purple-500/30 overflow-x-auto">
        <h2 className="text-xl font-bold mb-6 text-purple-400">📋 現有眾籌與 AI頂配教材列表（可隨時修改價格、教材連結與宣傳 HTML）</h2>
        {isLoading ? (
          <p>載入中...</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">中文名稱</th>
                <th className="p-3">英文名稱</th>
                <th className="p-3">數量</th>
                <th className="p-3">售價(USDT)</th>
                <th className="p-3">折扣/標籤</th>
                <th className="p-3">項目類型</th>
                <th className="p-3">📥 教材下載連結 (course_link)</th>
                <th className="p-3">🎨 宣傳文案 HTML</th>
                <th className="p-3">資料庫 (UI)</th>
                <th className="p-3">區塊鏈 (Web3)</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, idx) => {
                const hasCustomHtml = Boolean(pkg.promo_html_zh || pkg.promo_html_en);
                return (
                  <tr key={pkg.id} className="border-b border-gray-800 hover:bg-gray-700/50">
                    <td className="p-3 font-bold">{pkg.id}</td>
                    <td className="p-3">
                      <input type="text" value={pkg.name_zh || ''} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].name_zh = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 w-32 text-white" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={pkg.name_en || ''} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].name_en = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 w-32 text-gray-300" />
                    </td>
                    <td className="p-3">
                      <input type="number" value={pkg.amount} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].amount = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 w-14 text-white" />
                    </td>
                    <td className="p-3">
                      <input type="number" value={pkg.price} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].price = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 w-20 text-green-400 font-bold" />
                    </td>
                    <td className="p-3">
                      <input type="text" value={pkg.discount_text || ''} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].discount_text = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 w-24 text-white" />
                    </td>
                    <td className="p-3">
                      <select value={pkg.product_type || 'NFT_REDEEM'} onChange={e => {
                        const newPkgs = [...packages];
                        newPkgs[idx].product_type = e.target.value;
                        setPackages(newPkgs);
                      }} className="bg-black border border-gray-700 rounded px-2 py-1 text-xs text-white">
                        <option value="NFT_REDEEM">節點眾籌 (25%)</option>
                        <option value="DIRECT_COURSE">🎓 AI頂配教材 (25%)</option>
                        <option value="SPONSOR">純斗內 (無分潤)</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={pkg.course_link || ''}
                        onChange={e => {
                          const newPkgs = [...packages];
                          newPkgs[idx].course_link = e.target.value;
                          setPackages(newPkgs);
                        }}
                        className="bg-black border border-cyan-500/40 rounded px-2 py-1 w-36 text-cyan-300 text-xs"
                      />
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => setEditingPkgId(editingPkgId === pkg.id ? null : pkg.id)}
                        className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap cursor-pointer border ${
                          editingPkgId === pkg.id
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : hasCustomHtml
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                            : 'bg-gray-900 text-gray-300 border-gray-600 hover:bg-gray-700'
                        }`}
                      >
                        {editingPkgId === pkg.id ? '✏️ 編輯中' : hasCustomHtml ? '🎨 已設宣傳HTML' : '📝 編寫HTML'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleSaveFrontend(pkg.id)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs whitespace-nowrap cursor-pointer">
                        儲存更新
                      </button>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleUpdateSmartContract(pkg)}
                        disabled={isPending || !isConnected}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs disabled:opacity-50 whitespace-nowrap cursor-pointer"
                      >
                        {isPending ? '交易中...' : '寫入合約'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* 專為選定項目展開的「🎨 教材宣傳文案 HTML 工作台 + 即時視覺預覽」 */}
        {editingPkg && (
          <div className="mt-8 p-6 bg-gray-900 border-2 border-emerald-500/50 rounded-2xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  正在編輯方案 ID #{editingPkg.id}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  🎨 【{editingPkg.name_zh}】教材宣傳文案 HTML 工作台
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  您在此編寫的 HTML 宣傳文案、海報圖片或 YouTube 影片，將直接呈現在首頁「🔥 AI頂配教材導覽專區」中（若留空則自動顯示系統預設三大實戰模組卡片）。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPkgId(null)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs cursor-pointer"
              >
                ✕ 關閉工作台
              </button>
            </div>

            {/* 工具列：語系切換 + 4 大一鍵插入快捷鍵 */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveHtmlLang('zh')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeHtmlLang === 'zh'
                      ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  🇹🇼 中文版宣傳 HTML (promo_html_zh)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveHtmlLang('en')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    activeHtmlLang === 'en'
                      ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  🇺🇸 英文版宣傳 HTML (promo_html_en)
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => insertSnippetToEditor(activeHtmlLang === 'zh' ? DEFAULT_PROMO_TEMPLATE_ZH : DEFAULT_PROMO_TEMPLATE_EN, false)}
                  className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  ✨ 插入爆款銷售模板
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertImage(false)}
                  className="px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-400/40 text-pink-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🖼️ 插入宣傳海報/長圖
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertVideo(false)}
                  className="px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🎬 插入介紹短片/YouTube
                </button>
                <button
                  type="button"
                  onClick={() => updateEditingHtml('')}
                  className="px-3 py-2 bg-red-500/15 hover:bg-red-500/25 border border-red-400/30 text-red-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  🗑️ 清空(恢復預設模組)
                </button>
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-300 rounded-xl text-xs font-bold cursor-pointer"
                >
                  👁️ {showLivePreview ? '隱藏預覽' : '顯示預覽'}
                </button>
              </div>
            </div>

            {/* HTML 原始碼編輯框 */}
            <textarea
              rows={9}
              value={currentEditingHtml}
              onChange={e => updateEditingHtml(e.target.value)}
              placeholder={
                activeHtmlLang === 'zh'
                  ? '在此輸入或貼上您的中文宣傳文案 HTML 碼，或點擊上方「✨ 插入爆款銷售模板」一鍵生成後直接修改文字...'
                  : 'Enter or paste your English promotional HTML code here, or click "✨ 插入爆款銷售模板" above...'
              }
              className="w-full bg-black border border-gray-700 rounded-xl p-4 font-mono text-xs text-emerald-200 focus:border-emerald-400 focus:outline-none mb-6 leading-relaxed"
            />

            {/* 即時視覺預覽區 */}
            {showLivePreview && (
              <div className="mb-6">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span>👁️</span> 前台實際呈現即時預覽 ({activeHtmlLang === 'zh' ? '中文版視角' : '英文版視角'})：
                </div>
                <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-emerald-500/30 text-white">
                  {currentEditingHtml.trim() ? (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: currentEditingHtml }}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm italic text-center py-6">
                      目前尚未填寫自訂 HTML（前台將自動顯示系統內建的「AI頂配教材・三大核心實戰模組導覽卡片」）。
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSaveFrontend(editingPkg.id)}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-black font-black rounded-xl text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
              >
                💾 儲存【{editingPkg.name_zh}】宣傳文案 HTML 與設定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
