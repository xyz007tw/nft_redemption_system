import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { normalizeCoursePkgId, autoEnrollVipStudent } from '@/lib/vipEnroll';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

export async function POST(req: Request) {
  try {
    const { buyerEmail, walletAddress, targetEmail, packageId } = await req.json();

    if (!targetEmail || !targetEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: '請輸入有效的轉發目標電子信箱 (Invalid target email)' },
        { status: 400 }
      );
    }

    // 1. Verify buyer eligibility (by buyerEmail or walletAddress)
    let isVerified = false;
    if (buyerEmail && buyerEmail.includes('@')) {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('has_purchased, last_purchased_package')
        .eq('email', buyerEmail.trim().toLowerCase())
        .single();
      if (userByEmail?.has_purchased) {
        isVerified = true;
      }
    }

    if (!isVerified && walletAddress && walletAddress.startsWith('0x')) {
      const { data: userByWallet } = await supabase
        .from('users')
        .select('has_purchased')
        .ilike('wallet_address', walletAddress)
        .single();
      if (userByWallet?.has_purchased) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      return NextResponse.json(
        {
          success: false,
          error: '查無此信箱或錢包的購課紀錄，請先完成課程購買後再進行下載或轉發。(No purchase record found for this email/wallet.)'
        },
        { status: 403 }
      );
    }

    // 2. Fetch course info from packages table
    const { unpackPackageRow } = await import('@/lib/packageMeta');
    let courseName = 'AI 自動來客系統・AI頂配實戰教材 (WeiXiang AI Master Materials)';
    let courseLink = process.env.DEFAULT_COURSE_LINK || 'https://nft1314.party/redeem';

    const COURSE_MAP: Record<number, { name: string; link: string }> = {
      100: {
        name: '🏆 全套 10 門課 VIP 終身旗艦合輯（贈 2 枚微享 NFT 憑證）',
        link: 'https://vip.5208.uk/dashboard/'
      },
      101: {
        name: '教材 01｜20年首席架構師 · AI-ATM 自動商業變現大師班',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_101_ai_atm.pdf'
      },
      102: {
        name: '教材 02｜SaaS-AVME 3.0 雙引擎 AI 短影音自動化大師手冊',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_102_saas_avme.pdf'
      },
      103: {
        name: '教材 03｜WordPress 多語系自動化 SEO 站群變現術',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_103_wp_seo.pdf'
      },
      104: {
        name: '教材 04｜24H 零人工看守：AI Agent 智慧客服搭建與 RAG 實戰',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_104_ai_agent.pdf'
      },
      105: {
        name: '教材 05｜25% 聯盟裂變與全球金流自動交付系統深度解密',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_105_affiliate_25.pdf'
      },
      106: {
        name: '教材 06｜全球電子書自動交付與 100% 倒抵 SaaS 系統架構',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_106_ebook_saas.pdf'
      },
      107: {
        name: '教材 07｜LINE 貼圖 AI 批量生圖與全自動裁切上架實戰',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_107_line_sticker.pdf'
      },
      108: {
        name: '教材 08｜LiveGood 智能協辦與 AI 協播自動化系統',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_108_livegood_ai.pdf'
      },
      109: {
        name: '教材 09｜零成本獲客：AI 尋客 365 天自動拓客實操指南',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_109_ai_traffic.pdf'
      },
      110: {
        name: '教材 10｜Web3 NFT 數位憑證與智能合約商務賦能大師手冊',
        link: 'https://vip.5208.uk/wp-content/uploads/ebooks/material_110_web3_nft.pdf'
      }
    };

    if (packageId) {
      const pId = Number(packageId);
      const { data: rawPkg } = await supabase
        .from('packages')
        .select('*')
        .eq('id', pId)
        .single();
      const pkg = unpackPackageRow(rawPkg);
      if (pkg) {
        courseName = pkg.name_zh || courseName;
        if (pkg.course_link) courseLink = pkg.course_link;
      } else if (COURSE_MAP[pId]) {
        courseName = COURSE_MAP[pId].name;
        courseLink = COURSE_MAP[pId].link;
      }
    } else {
      const { data: allPkgs } = await supabase
        .from('packages')
        .select('*')
        .order('id', { ascending: true });
      const coursePkg = (allPkgs || []).map(unpackPackageRow).find((p: any) => p.product_type === 'DIRECT_COURSE');
      if (coursePkg) {
        courseName = coursePkg.name_zh || courseName;
        if (coursePkg.course_link) courseLink = coursePkg.course_link;
      }
    }

    const effectiveId = packageId ? normalizeCoursePkgId(Number(packageId)) : 101;
    let magicLoginUrl = courseLink;
    try {
      const enrollRes = await autoEnrollVipStudent(
        (buyerEmail && buyerEmail.includes('@')) ? buyerEmail.trim() : targetEmail.trim(),
        effectiveId,
        `FORWARD_${Date.now()}`
      );
      if (enrollRes.success && enrollRes.magic_login_url) {
        magicLoginUrl = enrollRes.magic_login_url;
      }
    } catch (e) {
      console.warn('[Course Forward] Magic link generation fallback:', e);
    }

    const downloadLinks = {
      primary: magicLoginUrl,
      zh_tw: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}_zh_tw.pdf`,
      zh_cn: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}_zh_cn.pdf`,
      en: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}_en.pdf`,
      ja: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}_ja.pdf`,
      code_zip: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}_source_code.zip`,
      interactive_html: `https://vip.5208.uk/wp-content/uploads/ebooks/material_${effectiveId}/master_bilingual.html`,
      magic_classroom: magicLoginUrl
    };

    // 3. Send email if SMTP credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"WeiXiang AI 學院" <${process.env.EMAIL_USER}>`,
        to: targetEmail.trim(),
        subject: `🎓 【WeiXiang AI】學員專屬多語系教材發貨：${courseName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #111827; margin-bottom: 8px;">🎓 歡迎學習：${courseName}</h2>
            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
              您好！您或您的團隊夥伴（${buyerEmail || walletAddress}）已成功解鎖微享 <strong>「${courseName}」</strong> 頂配實戰教材！
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <h4 style="margin: 0 0 12px; color: #0f172a; font-size: 15px;">📥 多語系電子書與隨堂資產下載專區：</h4>
              <ul style="list-style: none; padding: 0; margin: 0; line-height: 2;">
                <li>🇹🇼 <a href="${downloadLinks.zh_tw}" style="color: #0284c7; text-decoration: none; font-weight: bold;">繁體中文版 PDF 下載</a></li>
                <li>🇨🇳 <a href="${downloadLinks.zh_cn}" style="color: #0284c7; text-decoration: none; font-weight: bold;">简体中文版 PDF 下载</a></li>
                <li>🇺🇸 <a href="${downloadLinks.en}" style="color: #0284c7; text-decoration: none; font-weight: bold;">English Edition PDF Download</a></li>
                <li>🇯🇵 <a href="${downloadLinks.ja}" style="color: #0284c7; text-decoration: none; font-weight: bold;">日本語版 PDF ダウンロード</a></li>
                <li>🌐 <a href="${downloadLinks.interactive_html}" style="color: #059669; text-decoration: none; font-weight: bold;">在線雙語互動閱讀器 (R2 邊緣高速)</a></li>
                <li>💻 <a href="${downloadLinks.code_zip}" style="color: #7c3aed; text-decoration: none; font-weight: bold;">實戰代碼與 Prompt 完整資產包 (.zip)</a></li>
              </ul>
            </div>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${magicLoginUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #10b981, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                🚀 一鍵免密碼進入 VIP 實戰學員教室 (vip.5208.uk)
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">WeiXiang AI 自動來客系統團隊 · 24H 自動化發貨引擎</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      courseName,
      courseLink: magicLoginUrl,
      downloadLinks,
      message: `課程教材已成功發送至 ${targetEmail}！各語系版本已於 vip.5208.uk 同步就緒。`
    });
  } catch (error: any) {
    console.error('Course forward error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '轉發失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
