/**
 * Client-safe helpers and types for normalizing VIP cloud classroom signed download links.
 */

export interface VipSignedDownloadLinks {
  zh_tw: string;
  zh_cn: string;
  en: string;
  ja: string;
  code_zip: string;
  interactive_html: string;
}

export interface VipDownloadLinkItem {
  key: string;
  label: string;
  url: string;
}

/**
 * Convert a keyed object of VIP classroom signed URLs into display-ready label/url pairs.
 */
export function toDownloadLinkItems(links?: Partial<VipSignedDownloadLinks> | null): VipDownloadLinkItem[] {
  if (!links) return [];
  const entries: [keyof VipSignedDownloadLinks, string][] = [
    ['zh_tw', '🇹🇼 繁體中文版實戰手冊 (PDF)'],
    ['zh_cn', '🇨🇳 简体中文版实战手册 (PDF)'],
    ['en', '🇺🇸 English Master Edition (PDF)'],
    ['ja', '🇯🇵 日本語版ハンドブック (PDF)'],
    ['interactive_html', '🌐 雙語互動閱讀器 (HTML)'],
    ['code_zip', '💻 實戰源碼與 Prompt 資產包 (.zip)']
  ];
  return entries
    .filter(([k]) => Boolean(links[k]))
    .map(([key, label]) => ({ key, label, url: String(links[key]) }));
}
