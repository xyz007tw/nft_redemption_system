# Antigravity (AGY) - 微享 NFT 眾籌發行平台 核心憲法

本文件 (GEMINI.md) 為全代理矩陣之最高指導原則。所有子代理 (Subagents) 與主代理在執行任何腳本修改、產線發佈或除錯時，**必須絕對遵守**以下守則。

---

## 🚫 1. 基礎設施不可變更原則 (CRITICAL RULE)
> **Timestamp:** 2026-09-25

* **絕對守則**：原本已設置好的「微享 NFT (WeiXiang NFT)」基礎功能及程序（包含智能合約互動、PayUni 統一金流、Supabase 資料庫結構、雙引擎極差分潤機制）**皆不改變**。
* **變更核准機制**：若未來任何擴充開發 (如 Phase 2 的 AI 客服、線上家教系統) 需變更或動用到原生基礎部分，**必須提前向總指揮官 (User) 報告，並獲得明確的「同意執行」指示後，方能進行修改**。嚴禁代理擅自重構核心底層。

## 🏗️ 2. 系統架構與技術約定
* **前端框架**：Next.js App Router (使用 TypeScript, TailwindCSS)。
* **Web3 互動**：Wagmi / Viem (嚴禁降級為舊版 ethers.js)。
* **金流系統**：PayUni 信用卡一次性付清 (Credit: 1)。
* **資料庫**：Supabase (所有 API Route 初始化時必須使用 Placeholder Fallback，避免 Next.js 靜態編譯 `status 1` 崩潰)。
* **部署環境**：Render ($7/month Starter) - 確保修改後不會超出 512MB 記憶體編譯限制。

## 🛡️ 3. 新功能擴充備忘 (Phase 2 Backlog)
1. **AI 客服系統**：需使用 `gemini-2.5-flash` 與 Supabase pgvector。
2. **線上家教系統 (Token-Gated)**：需使用 Cloudflare R2 存放資源 (免 Egress Fee)，並遵循「Netflix 全斷模式」的權限管理，搭配「滴水式解鎖 (Drip Content)」與「動態 NFT 憑證變化」。
