import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

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
        link: 'https://vip.5208.uk/courses/all-master-bundle'
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
        subject: `🎓 【WeiXiang AI】學員轉發：${courseName} 下載與觀看連結`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
            <h2 style="color: #111827;">🎓 歡迎學習：${courseName}</h2>
            <p style="color: #374151; line-height: 1.6;">
              您好！您的親友或團隊夥伴（${buyerEmail || walletAddress}）已將微享 <strong>「${courseName}」</strong> 頂配家教課程教材轉發給您。
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <a href="${courseLink}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #10b981, #06b6d4); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                📥 立即下載 / 觀看家教課程教材
              </a>
            </div>
            <p style="color: #6b7280; font-size: 13px;">
              若按鈕無法點擊，請複製以下網址至瀏覽器開啟：<br/>
              <a href="${courseLink}" style="color: #2563eb;">${courseLink}</a>
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px;">WeiXiang AI 自動來客系統團隊 敬上</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      courseName,
      courseLink,
      message: `課程教材已成功發送至 ${targetEmail}！`
    });
  } catch (error: any) {
    console.error('Course forward error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '轉發失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
