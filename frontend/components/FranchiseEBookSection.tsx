'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { GLOBAL_BANNED_BOOK_CATEGORIES } from '@/lib/ebookEngine';
import PayUniButton from '@/components/PayUniButton';

export default function FranchiseEBookSection() {
  const { lang } = useLanguage();

  const [showBannedModal, setShowBannedModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<'YEAR1_990' | 'ADD_BOOK_360' | 'YEAR2_RENEW_450'>('YEAR1_990');
  const [agreedBannedTerms, setAgreedBannedTerms] = useState(false);
  const [agreedReviewDays, setAgreedReviewDays] = useState(false);

  const openJoinModal = (plan: 'YEAR1_990' | 'ADD_BOOK_360' | 'YEAR2_RENEW_450') => {
    setCheckoutPlan(plan);
    setAgreedBannedTerms(false);
    setAgreedReviewDays(false);
    setShowCheckoutModal(true);
  };

  const getPlanName = (plan: 'YEAR1_990' | 'ADD_BOOK_360' | 'YEAR2_RENEW_450') => {
    if (plan === 'YEAR1_990') {
      if (lang === 'ja-JP') return '知識の自動販売機 AI-ATM・初年度$990スタートプラン (電子書籍3冊 + AI自動集客広告 + 手数料100%相殺)';
      if (lang === 'zh-CN') return '知识自动贩卖机 AI-ATM・首年 $990 启动方案 (含 3 本书 + AI 自来客打广告 + $990 服务费 100% 倒抵)';
      if (lang === 'vi-VN') return 'Máy Bán Tri thức AI-ATM Gói Năm 1 - 990$ (3 Sách + Quảng cáo AI + Cấn trừ Phí 100%)';
      if (lang === 'id-ID') return 'Mesin Penjual Pengetahuan AI-ATM Tahun ke-1 - $990 (3 Buku + Trafik Iklan AI + Pengurangan 100%)';
      if (lang === 'en-US') return 'Knowledge Vending Machine AI-ATM Year-1 $990 Plan (3 Books + AI Traffic Ads + 100% Fee Credit)';
      return '知識自動販賣機 AI-ATM・首年 $990 啟動方案 (含 3 本書 + AI 自來客打廣告 + $990 服務費 100% 倒抵)';
    }
    if (plan === 'ADD_BOOK_360') {
      if (lang === 'ja-JP') return '知識の自販機追加枠 ($360 / 1冊分自動販売機開発権)';
      if (lang === 'zh-CN') return '知识自动贩卖机追加配额 ($360 / 1 本专书贩卖机开发权)';
      if (lang === 'vi-VN') return 'Hạn mức Máy Bán Sách Bổ sung ($360 / 1 Sách)';
      if (lang === 'id-ID') return 'Kuota Tambahan Mesin Penjual ($360 / 1 Buku)';
      if (lang === 'en-US') return 'Additional Knowledge Vending Machine ($360 / 1 Book)';
      return '知識自動販賣機額外追加配額 ($360 / 1 本專書販賣機開發權)';
    }
    // YEAR2_RENEW_450
    if (lang === 'ja-JP') return '次年度 AI自動集客広告＆自販機クラウドシステム保守費 ($450 手数料100%相殺特典付)';
    if (lang === 'zh-CN') return '次年 AI 自来客广告与贩卖机云端服务费 ($450 同享 100% 倒抵 10% 服务费)';
    if (lang === 'vi-VN') return 'Phí Duy trì Máy Bán & Lưu lượng AI Năm 2 ($450 Hoàn phí 100%)';
    if (lang === 'id-ID') return 'Perpanjangan Mesin Penjual & Iklan AI Tahun ke-2 ($450 Pengurangan 100%)';
    if (lang === 'en-US') return 'Year-2 AI Traffic & Vending Machine Renewal ($450 with 100% Fee Credit)';
    return '次年 AI 自來客廣告與販賣機雲端服務費 ($450 同享 100% 倒抵 10% 服務費)';
  };

  const planPrice = checkoutPlan === 'YEAR1_990' ? 990 : checkoutPlan === 'ADD_BOOK_360' ? 360 : 450;

  // 多語系介面字典
  const t = {
    topBadge: ({
      'zh-TW': '📚 誠邀全球創作者體驗 ×「知識自動販賣機 AI-ATM」連鎖店',
      'zh-CN': '📚 诚邀全球创作者体验 ×“知识自动贩卖机 AI-ATM”连锁店',
      'en-US': '📚 Inviting Global Creators × "Knowledge Vending Machine AI-ATM" Network',
      'ja-JP': '📚 世界のクリエイターへ体験招待 ×「知識の自動販売機 AI-ATM」チェーン店',
      'vi-VN': '📚 Mời Tác giả Toàn cầu Trải nghiệm × Chuỗi "Máy Bán Tri thức Tự động AI-ATM"',
      'id-ID': '📚 Mengundang Kreator Global × Jaringan "Mesin Penjual Pengetahuan Otomatis AI-ATM"'
    } as Record<string, string>)[lang] || '📚 Inviting Global Creators × "Knowledge Vending Machine AI-ATM" Network',
    heroTitle: ({
      'zh-TW': '零技術！首年 $990 開設你的「知識自動販賣機 AI-ATM」＋ AI 24H 睡覺都在幫你打廣告找客人！',
      'zh-CN': '零技术！首年 $990 开设你的“知识自动贩卖机 AI-ATM”＋ AI 24H 睡觉都在帮您打广告找客人！',
      'en-US': 'Zero Tech Skills! Launch Your "Knowledge Vending Machine AI-ATM" for $990 + 24/7 AI Ad Traffic While You Sleep!',
      'ja-JP': '専門知識ゼロ！初年度$990で「知識の自動販売機 AI-ATM」を開設 ＋ AIが24時間寝ている間も自動集客！',
      'vi-VN': 'Không cần Kỹ thuật! Khởi tạo "Máy Bán Tri thức AI-ATM" chỉ $990 + AI Tự động Tìm khách 24/7 kể cả khi bạn ngủ!',
      'id-ID': 'Tanpa Keterampilan Teknis! Buka "Mesin Penjual Pengetahuan AI-ATM" Seharga $990 + Iklan AI Otomatis 24/7 Saat Anda Tidur!'
    } as Record<string, string>)[lang] || 'Zero Tech Skills! Launch Your "Knowledge Vending Machine AI-ATM" for $990 + 24/7 AI Ad Traffic While You Sleep!',
    heroSub: ({
      'zh-TW': '不懂程式、沒時間寫書也能當作家！內建 Google 4 旗艦大腦，一鍵自動產出 25+ 頁圖文並茂全球暢銷專書（可自行下載母檔＋定價開賣）。首年 $990 與次年 $450 系統費全享【100% 倒抵手續費】零風險返還，連鎖店 24 小時睡覺自動收錢！',
      'zh-CN': '不懂编程、没时间写书也能当作家！内置 Google 4 旗舰大脑，一键自动产出 25+ 页图文并茂全球畅销专书（可自行下载母档＋定价开卖）。首年 $990 与次年 $450 系统费全享【100% 倒抵手续费】零风险返还，连锁店 24 小时睡觉自动收钱！',
      'en-US': 'No coding or writing needed! Powered by Google 4 AI, automatically create 25+ page illustrated authority books (download master files + sell online). Both Year-1 ($990) and Year-2 ($450) fees are 100% offset by transaction fee credits—100% risk-free passive income!',
      'ja-JP': 'プログラミングも執筆時間も不要！Google 4 旗艦AIが、25ページ超の図解ベストセラー書籍を自動生成（マスター保存＆即時オンライン販売対応）。初年度$990・次年度$450のシステム費はすべて【10%販売手数料から100%相殺】され、ノーリスクで24時間寝ている間も不労所得を獲得！',
      'vi-VN': 'Không cần biết lập trình hay dành hàng tháng viết sách! Tích hợp Google 4 AI tự động tạo sách bán chạy 25+ trang có hình minh họa (tải file master & bán ngay). Hoàn phí 100% cho cả Năm 1 ($990) và Năm 2 ($450)—tạo dòng tiền thụ động 24/7 không rủi ro!',
      'id-ID': 'Tidak perlu coding atau menulis berbulan-bulan! Didukung Google 4 AI untuk otomatis menghasilkan buku otoritas 25+ halaman berilustrasi (unduh file master + jual online). Biaya tahun ke-1 ($990) dan ke-2 ($450) dikurangi 100% dari biaya transaksi—penghasilan pasif bebas risiko 24/7!'
    } as Record<string, string>)[lang] || 'Powered by Google 4 AI: Launch your Knowledge Vending Machine with 100% Fee Credit Rebate!',

    // 4 Core Cards
    c1Title: ({
      'zh-TW': '1. 首年 $990 送 3 台知識自動販賣機 ＋ AI 24H 幫打廣告',
      'zh-CN': '1. 首年 $990 送 3 台知识自动贩卖机 ＋ AI 24H 帮打广告',
      'en-US': '1. Year-1 $990: 3 Vending Machines (3 Books) + 24/7 AI Ads',
      'ja-JP': '1. 初年度$990で自動販売機3台(書籍3冊分) ＋ AIが24時間集客広告',
      'vi-VN': '1. Năm 1: $990 Tặng 3 Máy Bán Tự Động (3 Sách) + AI Chạy Quảng Cáo 24/7',
      'id-ID': '1. Tahun ke-1: $990 Dapat 3 Mesin Otomatis (3 Buku) + Iklan AI 24/7'
    } as Record<string, string>)[lang] || '1. Year-1 $990: 3 Vending Machines (3 Books) + 24/7 AI Ads',
    c1Desc: ({
      'zh-TW': '不用自己敲鍵盤！首年認購直接解鎖 3 本專屬雙語電子書販賣機（可一鍵下載 PDF/HTML 母檔珍藏，亦可直接上架線上書櫃收款）。更直接串聯「微享 AI 自動來客」，每天在社群替你自動發傳單、打廣告拉客人！第 4 本起每本僅 $360，每本送 30 次免費微調！',
      'zh-CN': '不用自己敲键盘！首年认购直接解锁 3 本专属双语电子书贩卖机（可一键下载 PDF/HTML 母档珍藏，亦可直接上架线上书柜收款）。更直接串联“微享 AI 自动来客”，每天在社群替您自动发传单、打广告拉客人！第 4 本起每本仅 $360，每本送 30 次免费微调！',
      'en-US': 'No typing required! Unlock 3 bilingual knowledge vending machines (download master PDF/HTML & sell online). WeiXiang AI auto-traffic matrix distributes flyers and runs social ads daily to bring paying buyers! Additional machines from 4th book are only $360/book, with 30 free edits each!',
      'ja-JP': 'キーボードを叩く必要すらありません！初年度で3冊分の多言語自動販売機を解放（PDF/HTMLマスターダウンロード＆即座に販売可能）。さらに「WeiXiang AI自動集客」が毎日SNSでチラシを配り自動で顧客を獲得！4冊目以降は1冊わずか$360、各書籍30回分の無料修正枠付き！',
      'vi-VN': 'Không cần tự gõ phím! Mở khóa 3 máy bán sách tự động song ngữ (tải file PDF/HTML & bán nhận tiền ngay). Hệ thống AI tự động phát tờ rơi và quảng cáo trên mạng xã hội mỗi ngày! Từ cuốn thứ 4 chỉ $360/cuốn, tặng 30 lần chỉnh sửa miễn phí!',
      'id-ID': 'Tidak perlu mengetik sendiri! Dapatkan 3 mesin penjual buku bilingual (unduh PDF/HTML master & jual langsung). Matriks AI menyebarkan brosur dan beriklan di medsos setiap hari! Buku ke-4 dan seterusnya hanya $360/buku, dengan 30 kali revisi gratis!'
    } as Record<string, string>)[lang] || 'Includes 3 e-book vending machines + 24/7 AI Traffic!',
    c1Tag: ({
      'zh-TW': '✔ 內含 3 本專書販賣機(第4本起$360)｜每本送30次免費微調',
      'zh-CN': '✔ 内含 3 本专书贩卖机(第4本起$360)｜每本送30次免费微调',
      'en-US': '✔ Includes 3 Vending Machines ($360/extra) | 30 Free Edits/Book',
      'ja-JP': '✔ 自動販売機3台分付属(4冊目から$360)｜各30回無料微調整',
      'vi-VN': '✔ Gồm 3 máy bán sách ($360/máy thêm) | 30 lần sửa miễn phí',
      'id-ID': '✔ Termasuk 3 Mesin Buku ($360/tambah) | 30 Revisi Gratis'
    } as Record<string, string>)[lang] || '✔ 3 Vending Machines Included',

    c2Title: ({
      'zh-TW': '2. 10% 系統費 100% 全額倒抵 ＋ 全球推廣大軍幫你賣',
      'zh-CN': '2. 10% 系统费 100% 全额倒抵 ＋ 全球推广大军帮您卖',
      'en-US': '2. 100% System Fee Credit Rebate + Global Affiliate Army',
      'ja-JP': '2. システム費10%を100%全額相殺 ＋ 世界の販売軍団が代理宣伝',
      'vi-VN': '2. Hoàn phí Hệ thống 100% + Đội quân Tiếp thị Toàn cầu Bán hộ',
      'id-ID': '2. Pengurangan 100% Biaya Sistem + Pasukan Afiliasi Global'
    } as Record<string, string>)[lang] || '2. 100% System Fee Credit Rebate + Global Affiliate Army',
    c2Desc: ({
      'zh-TW': '開販賣機零負擔！原本收取的 1 成 (10%) 系統服務費，100% 直接從你預繳的 $990 抵用金倒扣返還（抵滿前手續費 0% 全額歸你）！同時自動接軌全球「25% 聯盟分潤大軍」，讓世界各地的推廣者都搶著主動幫你的販賣機賣書！',
      'zh-CN': '开贩卖机零负担！原本收取的 1 成 (10%) 系统服务费，100% 直接从您预缴的 $990 抵用金倒扣返还（抵满前手续费 0% 全额归您）！同时自动接轨全球“25% 联盟分润大军”，让世界各地的推广者都抢着主动帮您的贩卖机卖书！',
      'en-US': 'Zero operational burden! Our 10% system service fee is 100% credited against your $990 prepaid balance (0% effective system fee until depleted). Plus, our 25% global affiliate army is automatically incentivized to promote and sell your books worldwide!',
      'ja-JP': '自動販売機オーナーの負担はゼロ！通常の10%システム費は、前払いされた$990の相殺金から100%全額差し引かれます（実質手数料0%）！さらに世界中の宣伝者が25%アフィリエイト報酬を目的に、あなたの書籍を競って自動販売してくれます！',
      'vi-VN': 'Kinh doanh máy bán tri thức không gánh nặng! 10% phí hệ thống được cấn trừ 100% từ $990 trả trước (0% phí cho đến khi cấn trừ hết). Đồng thời đội ngũ tiếp thị liên kết 25% toàn cầu sẽ chủ động bán sách giúp bạn!',
      'id-ID': 'Bebas beban biaya operasional! Biaya sistem 10% dipotong 100% dari saldo $990 Anda (biaya sistem efektif 0% hingga habis). Ditambah pasukan afiliasi global 25% yang antusias mempromosikan buku Anda ke seluruh dunia!'
    } as Record<string, string>)[lang] || '100% System Fee Rebate + Global Affiliate Army',
    c2Tag: ({
      'zh-TW': '✔ 10%系統費全額倒抵返還｜25%全球推廣大軍主動幫賣',
      'zh-CN': '✔ 10%系统费全额倒抵返还｜25%全球推广大军主动帮卖',
      'en-US': '✔ 100% Fee Offset | 25% Global Promoters Sell for You',
      'ja-JP': '✔ 10%手数料100%相殺返還｜25%世界アフィリエイト軍団が販売',
      'vi-VN': '✔ Hoàn 100% phí dịch vụ | Đội ngũ 25% hoa hồng bán hộ',
      'id-ID': '✔ Pengurangan 100% Biaya | 25% Pasukan Promotor Ikut Menjual'
    } as Record<string, string>)[lang] || '✔ 100% Fee Rebated',

    c3Title: ({
      'zh-TW': '3. 次年 $450 雲端維護（同享 100% 倒抵返還）',
      'zh-CN': '3. 次年 $450 云端维护（同享 100% 倒抵返还）',
      'en-US': '3. Year-2 $450 Cloud Maintenance (100% Fee Rebate)',
      'ja-JP': '3. 次年度 $450 クラウド保守（100%相殺特典付き）',
      'vi-VN': '3. Phí Duy trì Năm 2: $450 (Cũng Hoàn 100% Không Mất Phí)',
      'id-ID': '3. Pemeliharaan Cloud Tahun ke-2: $450 (Pengurangan 100%)'
    } as Record<string, string>)[lang] || '3. Year-2 $450 Cloud Maintenance (100% Fee Rebate)',
    c3Desc: ({
      'zh-TW': '第二年起每年僅 $450 雲端維護費，維持你的販賣機 24H 不停機運轉與 AI 自動宣傳，同樣享有【100% 倒抵交易手續費】！只要一年賣滿 $4,500，就等於次年系統費全數免費拿回，下班後的持續被動收入永不中斷！',
      'zh-CN': '第二年起每年仅 $450 云端维护费，维持您的贩卖机 24H 不停机运转与 AI 自动宣传，同样享有【100% 倒抵交易手续费】！只要一年卖满 $4,500，就等于次年系统费全数免费拿回，下班后的持续被动收入永不中断！',
      'en-US': 'From Year 2, annual maintenance is only $450 to keep your vending machine operating 24/7 with continuous AI ads. This $450 ALSO 100% offsets your 10% transaction fees! Sell $4,500 in a year and your system fee is effectively 100% free!',
      'ja-JP': '2年目以降のクラウド保守費は年間わずか$450。あなたの自動販売機を24時間稼働させAI宣伝を継続します。こちらも【10%販売手数料から100%全額相殺】！年間$4,500の売上で実質ゼロ円となり、持続的な不労所得が止まりません！',
      'vi-VN': 'Từ năm thứ 2, phí duy trì đám mây chỉ $450/năm để máy hoạt động 24/7 cùng AI quảng bá liên tục. Khoản $450 này CŨNG ĐƯỢC HOÀN 100% vào phí giao dịch 10%! Bán $4,500/năm là hoàn toàn miễn phí!',
      'id-ID': 'Mulai tahun ke-2, biaya cloud hanya $450/tahun agar mesin beroperasi 24/7 dengan iklan AI. $450 ini JUGA DIKURANGKAN 100% dari biaya transaksi 10%! Jual $4,500 dalam setahun maka sistem Anda 100% gratis!'
    } as Record<string, string>)[lang] || 'From Year 2, annual fee is $450 with 100% rebate!',
    c3Tag: ({
      'zh-TW': '✔ 先收費後 100% 抵扣 10% 手續費｜賣滿即享全額免單',
      'zh-CN': '✔ 先收费后 100% 抵扣 10% 手续费｜卖满即享全额免单',
      'en-US': '✔ 100% Offset Against 10% Fee | Zero-Cost When Target Met',
      'ja-JP': '✔ 10%手数料から100%全額相殺｜売上達成で実質完全無料',
      'vi-VN': '✔ Cấn trừ 100% vào phí 10% | Đạt chỉ tiêu hoàn vốn 100%',
      'id-ID': '✔ Potongan 100% dari Biaya 10% | Gratis Sepenuhnya Saat Target Tercapai'
    } as Record<string, string>)[lang] || '✔ 100% Offset Against Service Fee',

    c4Title: ({
      'zh-TW': '4. 嚴格品質把關 (3~7天審核) ＋ 禁書免責保障',
      'zh-CN': '4. 严格品质把关 (3~7天审核) ＋ 禁书免责保障',
      'en-US': '4. Quality Review (3-7 Days) & Global Compliance',
      'ja-JP': '4. 厳格な品質管理(3〜7日審査) ＆ 禁止図書ポリシー',
      'vi-VN': '4. Kiểm Duyệt Chất Lượng (3-7 Ngày) & An Toàn Tuân Thủ',
      'id-ID': '4. Kontrol Kualitas Ketat (3-7 Hari) & Perlindungan Kepatuhan'
    } as Record<string, string>)[lang] || '4. Quality Review (3-7 Days) & Global Compliance',
    c4Desc: ({
      'zh-TW': '設定完成後由系統進行 3~7 天專業書審，確保每一台販賣機內容優質合規，保障全球信用卡/USDT秒級自動入帳。嚴格杜絕色情欺詐等 10 大禁書，為你的個人自品牌、聲譽與長期被動金流提供最堅實的護城河！',
      'zh-CN': '设定完成后由系统进行 3~7 天专业书审，确保每一台贩卖机内容优质合规，保障全球信用卡/USDT秒级自动入账。严格杜绝色情欺诈等 10 大禁书，为您的个人自品牌、声誉与长期被动金流提供最坚实的护城河！',
      'en-US': 'Books undergo a 3-7 day review to guarantee quality, protecting instant international credit card and USDT payouts. Strictly prohibiting the 10 banned book categories shields your brand reputation and sustains long-term passive cash flow!',
      'ja-JP': '設定後3〜7日間の専門審査を行い、自販機の内容が国際基準に適合していることを確認。安全なカード決済・USDT即時入金を保証します。10大禁止図書を厳格に排除し、あなたのブランドと不労所得を守り抜きます！',
      'vi-VN': 'Hệ thống kiểm duyệt 3-7 ngày đảm bảo nội dung chất lượng cao, giúp thanh toán thẻ tín dụng/USDT quốc tế hoạt động mượt mà. Nghiêm cấm 10 điều cấm để bảo vệ uy tín thương hiệu và dòng tiền thụ động dài hạn của bạn!',
      'id-ID': 'Audit buku 3-7 hari memastikan kualitas tinggi dan kepatuhan hukum, menjamin pembayaran kartu kredit/USDT instan. Melarang keras 10 kategori terlarang demi reputasi dan aliran kas pasif jangka panjang Anda!'
    } as Record<string, string>)[lang] || 'Completed books enter review with strict compliance.',
    c4Tag: ({
      'zh-TW': '⚠️ 專業書審 3~7 天｜杜絕違規禁書保護品牌',
      'zh-CN': '⚠️ 专业书审 3~7 天｜杜绝违规禁书保护品牌',
      'en-US': '⚠️ 3-7 Day Quality Review | Brand Protection Guaranteed',
      'ja-JP': '⚠️ 専門審査3〜7日｜規約遵守でブランドと売上を保護',
      'vi-VN': '⚠️ Kiểm duyệt 3-7 ngày | Bảo vệ thương hiệu và doanh thu',
      'id-ID': '⚠️ Audit 3-7 Hari | Perlindungan Merek & Kepatuhan Terjamin'
    } as Record<string, string>)[lang] || '⚠️ Strictly Compliant',

    // Compliance Alert
    noticeBadge: ({
      'zh-TW': '🚨 加盟商付款前必讀聲明（事前公開透明條款）',
      'zh-CN': '🚨 加盟商付款前必读声明（事前公开透明条款）',
      'en-US': '🚨 MANDATORY PRE-PAYMENT COMPLIANCE NOTICE',
      'ja-JP': '🚨 加盟店決済前の必須確認事項（事前公開透明規約）',
      'vi-VN': '🚨 THÔNG BÁO TUÂN THỦ TRƯỚC KHI THANH TOÁN',
      'id-ID': '🚨 PEMBERITAHUAN KEPATUHAN WAJIB SEBELUM BAYAR'
    } as Record<string, string>)[lang] || '🚨 MANDATORY PRE-PAYMENT COMPLIANCE NOTICE',
    noticeHead: ({
      'zh-TW': '全球電子書 10 大不可上架禁書規範 ＆ 總後台 3~7 天書審制度',
      'zh-CN': '全球电子书 10 大不可上架禁书规范 ＆ 总后台 3~7 天书审制度',
      'en-US': '10 Global Banned E-Book Categories & 3-7 Day Admin Review Policy',
      'ja-JP': '世界電子書籍 10大禁止図書基準 ＆ 3〜7日間の公式審査制度',
      'vi-VN': '10 Danh mục E-Book Bị Cấm Toàn cầu & Chính sách Duyệt 3-7 Ngày',
      'id-ID': '10 Kategori E-Book Dilarang Global & Kebijakan Audit 3-7 Hari'
    } as Record<string, string>)[lang] || '10 Global Banned E-Book Categories & 3-7 Day Admin Review Policy',
    viewBannedBtn: ({
      'zh-TW': '📜 展開閱讀完整《全球 10 大禁書條款細則》',
      'zh-CN': '📜 展开阅读完整《全球 10 大禁书条款细则》',
      'en-US': '📜 View Full 10 Banned Book Categories',
      'ja-JP': '📜 《世界10大禁止図書基準》の全文を読む',
      'vi-VN': '📜 Xem Chi tiết 10 Danh mục Bị Cấm',
      'id-ID': '📜 Lihat Lengkap 10 Kategori Terlarang'
    } as Record<string, string>)[lang] || '📜 View Full 10 Banned Book Categories',
    noticeSummary: ({
      'zh-TW': '為維護國際信用卡金流（PayUni / Visa / Mastercard）與全球出版合規，本平台嚴禁上架以下 10 大類禁書：① 色情猥褻與未成年不當內容、② 恐怖暴力與武器毒物製造、③ 毒品與違禁藥品、④ 非法賭博詐騙與洗錢教學、⑤ 非法金融吸金與保證獲利資金盤、⑥ 誇大醫療療效偏方、⑦ 盜版侵權與抄襲洗稿、⑧ 侵犯個人隱私肉搜與惡意誹謗、⑨ 仇恨言論與危害國安、⑩ 惡意木馬釣魚連結或欺詐空殼書。',
      'zh-CN': '为维护国际信用卡金流（PayUni / Visa / Mastercard）与全球出版合规，本平台严禁上架以下 10 大类禁书：① 色情猥亵与未成年不当内容、② 恐怖暴力与武器毒物制造、③ 毒品与违禁药品、④ 非法赌博诈骗与洗钱教学、⑤ 非法金融吸金与保证获利资金盘、⑥ 夸大医疗疗效偏方、⑦ 盗版侵权与抄袭洗稿、⑧ 侵犯个人隐私肉搜与恶意诽谤、⑨ 仇恨言论与危害国安、⑩ 恶意木马钓鱼链接或欺诈空壳书。',
      'en-US': 'To comply with international payment gateways and publishing laws, 10 categories are strictly prohibited: (1) Pornography/CSAM, (2) Terrorism/Weapons, (3) Illicit Drugs, (4) Gambling/Scams/Money Laundering, (5) Ponzi/Guaranteed Returns, (6) Fake Medical Cures, (7) Piracy/Copyright Infringement, (8) Doxxing/Defamation, (9) Hate Speech, (10) Phishing/Spam.',
      'ja-JP': '国際決済ゲートウェイ（PayUni / Visa / Mastercard）および出版コンプライアンス遵守のため、以下の10大禁止図書の登録を固く禁止します：① ポルノ・わいせつ・未成年者不適切表現、② テロ・暴力・兵器毒物製造、③ 違法薬物・規制薬品、④ 違法賭博・詐欺・資金洗浄、⑤ 無許可金融勧誘・ポンジスキーム、⑥ 誇大医療効果・疑似科学、⑦ 海賊版・著作権侵害・剽窃、⑧ プライバシー侵害・個人特定・誹謗中傷、⑨ ヘイトスピーチ・国家安全保障脅威、⑩ マルウェア・フィッシング・空書籍。',
      'vi-VN': 'Để tuân thủ các cổng thanh toán quốc tế và luật xuất bản, nghiêm cấm 10 danh mục: (1) Nội dung khiêu dâm/CSAM, (2) Khủng bố/Vũ khí, (3) Chất cấm, (4) Cờ bạc/Lừa đảo/Rửa tiền, (5) Mô hình Ponzi/Cam kết lợi nhuận phi thực tế, (6) Y tế giả mạo, (7) Vi phạm bản quyền, (8) Xâm phạm quyền riêng tư, (9) Kích động thù hận, (10) Mã độc/Sách rác lừa đảo.',
      'id-ID': 'Untuk mematuhi gateway pembayaran internasional dan hukum penerbitan, 10 kategori dilarang keras: (1) Pornografi/CSAM, (2) Terorisme/Senjata, (3) Narkoba/Obat Terlarang, (4) Perjudian/Penipuan/Pencucian Uang, (5) Skema Ponzi/Janji Keuntungan Palsu, (6) Klaim Medis Palsu, (7) Pelanggaran Hak Cipta, (8) Pelanggaran Privasi/Pencemaran Nama Baik, (9) Ujaran Kebencian, (10) Tautan Berbahaya/Buku Sampah Palsu.'
    } as Record<string, string>)[lang] || '10 categories strictly prohibited.',
    noticeWarningBox: ({
      'zh-TW': '📌 【重要須知】：(1) 加盟商在線上模版引擎完成電子書設定後，系統將自動送入管理後台進行「書審（審核時間 3~7 個工作天）」，通過後方可正式公開銷售與投放 AI 廣告；(2) 加盟商於付款前須清楚了解上述禁書條款，付款後若因違反禁書規定或遭檢舉查證屬實，一律永久下架封號且【絕對不予退費】！',
      'zh-CN': '📌 【重要须知】：(1) 加盟商在在线模版引擎完成电子书设定后，系统将自动送入管理后台进行“书审（审核时间 3~7 个工作天）”，通过后方可正式公开销售与投放 AI 广告；(2) 加盟商于付款前须清楚了解上述禁书条款，付款后若因违反禁书规定或遭检举查证属实，一律永久下架封号且【绝对不予退费】！',
      'en-US': '📌 [IMPORTANT]: (1) All e-books undergo a 3-7 day Admin Compliance Review after setup before going live; (2) Please read the banned book rules carefully before payment. Any violation or verified report after payment results in immediate termination with NO REFUND!',
      'ja-JP': '📌 【重要事項】：(1) 電子書籍設定完了後、管理システムで「公式書籍審査（3〜7営業日）」が実施され、承認後に一般公開販売およびAI広告宣伝が開始されます。(2) 決済前に禁止図書基準を必ずご確認ください。決済完了後、禁止規定違反や通報が確認された場合、永久アカウント停止となり【一切返金いたしません】。',
      'vi-VN': '📌 [QUAN TRỌNG]: (1) Tất cả sách đều phải qua khâu duyệt 3-7 ngày trước khi phát hành; (2) Vui lòng đọc kỹ các quy định cấm trước khi thanh toán. Mọi vi phạm sau khi thanh toán sẽ bị đóng tài khoản vĩnh viễn và KHÔNG HOÀN TIỀN!',
      'id-ID': '📌 [PENTING]: (1) Semua e-book melalui audit kepatuhan admin 3-7 hari sebelum dirilis; (2) Harap baca aturan buku terlarang sebelum membayar. Pelanggaran apa pun akan berakibat pemblokiran permanen dengan TANPA PENGEMBALIAN DANA!'
    } as Record<string, string>)[lang] || 'Important review policy and no-refund terms.',

    // Bespoke Custom Service Card (User Screenshot 1)
    bespokeBadge: ({
      'zh-TW': '🛠️ 企業名家 × 頂級高客單專案委託 (Enterprise VIP Bespoke Publishing)',
      'zh-CN': '🛠️ 企业名家 × 顶级高客单专案委托 (Enterprise VIP Bespoke Publishing)',
      'en-US': '🛠️ Enterprise VIP Bespoke E-Book Publishing Service',
      'ja-JP': '🛠️ 企業・名家向け × 最高峰フルカスタム出版受託 (Enterprise VIP Bespoke Publishing)',
      'vi-VN': '🛠️ Dành cho Doanh nghiệp & Chuyên gia × Dịch vụ Xuất bản May đo Cao cấp',
      'id-ID': '🛠️ Perusahaan VIP × Layanan Penerbitan E-Book Khusus (Bespoke)'
    } as Record<string, string>)[lang] || '🛠️ Enterprise VIP Bespoke E-Book Publishing Service',
    bespokeTitle: ({
      'zh-TW': '沒時間打字？「知識自動販賣機 一條龍全代工服務」由總工程師團隊親自操刀！',
      'zh-CN': '没时间打字？“知识自动贩卖机 一条龙全代工服务”由总工程师团队亲自操刀！',
      'en-US': 'No Time to Type? Full-Turnkey "AI-ATM Vending Machine Service" by CTO SEN Team!',
      'ja-JP': '文字を入力する時間もない方へ：「知識の自販機AI-ATM ワンストップ完全代行」をSENチームが直轄制作！',
      'vi-VN': 'Không có thời gian soạn thảo? "Dịch vụ Máy Bán Tri thức Trọn gói" do Đội ngũ CTO SEN thực hiện!',
      'id-ID': 'Tidak Ada Waktu Mengetik? "Layanan Kustom Mesin Penjual AI-ATM Siap Pakai" oleh Tim CTO SEN!'
    } as Record<string, string>)[lang] || 'No Time to Type? Full-Turnkey "AI-ATM Vending Machine Service" by CTO SEN Team!',
    bespokeSub: ({
      'zh-TW': '專為跨國企業、高階名師、品牌創辦人量身打造：只需口述訪談或提供零散想法，由 20 年架構經驗總工程師 SEN 團隊全包式交付！從 Google 4 旗艦圖文編撰、CIS 品牌視覺排版，到 4K 雙主播短影音矩陣宣傳與金流自動交付，讓你輕鬆擁有一整座全球化 AI 知識變現王國！（專案預算 $2,000~$5,000 USD，完工結案亦全額納入 25% 聯盟分潤！）',
      'zh-CN': '专为跨国企业、高阶名师、品牌创办人量身打造：只需口述访谈或提供零散想法，由 20 年架构经验总工程师 SEN 团队全包式交付！从 Google 4 旗舰图文编撰、CIS 品牌视觉排版，到 4K 双主播短影音矩阵宣传与金流自动交付，让您轻松拥有一整座全球化 AI 知识变现王国！（专案预算 $2,000~$5,000 USD，完工结案亦全额纳入 25% 联盟分润！）',
      'en-US': 'Tailored for enterprises, speakers, and creators: Simply share voice notes or ideas; our team with 20 years of architecture experience handles everything! From Google 4 AI writing, CIS visual typography, to 4K dual-anchor video promotion and payment pipelines ($2,000~$5,000 USD, 25% affiliate eligible)!',
      'ja-JP': 'グローバル企業、著名講師、事業主向け：インタビューや音声メモを渡すだけ！20年のシステム構築実績を持つSENチームが全工程を代行。Google 4 による図解編纂、ブランドCISデザイン、4Kアナウンサー動画宣伝、決済・自動納品まで完備！（予算 $2,000〜$5,000 USD、完了時25%アフィリエイト対象）',
      'vi-VN': 'Thiết kế riêng cho doanh nghiệp và chuyên gia: Chỉ cần ghi âm chia sẻ ý tưởng, đội ngũ 20 năm kinh nghiệm của CTO SEN sẽ thực hiện toàn bộ! Từ biên soạn Google 4, dàn trang chuẩn CIS, video 4K phát sóng đến hệ thống thanh toán tự động ($2,000~$5,000 USD, áp dụng 25% hoa hồng)!',
      'id-ID': 'Khusus untuk perusahaan, pakar, dan kreator: Cukup bagikan rekaman suara ide Anda, tim dengan 20 tahun pengalaman arsitektur CTO SEN akan menangani semuanya! Dari penyusunan Google 4, tata letak visual CIS, video promosi 4K, hingga pembayaran otomatis ($2,000~$5,000 USD, komisi 25%)!'
    } as Record<string, string>)[lang] || 'Full-turnkey knowledge vending machine service delivered by CTO SEN!',
    budgetLabel: ({
      'zh-TW': '專案委託預算區間',
      'zh-CN': '专案委托预算区间',
      'en-US': 'Budget Range',
      'ja-JP': 'プロジェクト予算目安',
      'vi-VN': 'Ngân sách Dự án',
      'id-ID': 'Kisaran Anggaran Proyek'
    } as Record<string, string>)[lang] || 'Budget Range',
    budgetDesc: ({
      'zh-TW': 'USDT / 信用卡・依規模簽約議價',
      'zh-CN': 'USDT / 信用卡・依规模签约议价',
      'en-US': 'USDT / Card · Contracted by Scope',
      'ja-JP': 'USDT / クレジットカード・規模に応じた契約',
      'vi-VN': 'USDT / Thẻ tín dụng · Hợp đồng theo quy mô',
      'id-ID': 'USDT / Kartu Kredit · Sesuai Kontrak Proyek'
    } as Record<string, string>)[lang] || 'USDT / Card · Contracted by Scope',

    // Bespoke 4 Cards
    b1Title: ({
      'zh-TW': '🎙️ 1對1 深度訪談代撰',
      'zh-CN': '🎙️ 1对1 深度访谈代撰',
      'en-US': '🎙️ 1-on-1 AI Interview',
      'ja-JP': '🎙️ 1対1 深層取材・代筆執筆',
      'vi-VN': '🎙️ Phỏng vấn Chuyên sâu 1-kèm-1',
      'id-ID': '🎙️ Wawancara Mendalam 1-on-1'
    } as Record<string, string>)[lang] || '🎙️ 1-on-1 AI Interview',
    b1Desc: ({
      'zh-TW': '由專人訪談錄音或提供零碎素材，AI 旗艦總編纂代理自動擴編成 25+ 頁麥肯錫架構權威專書。',
      'zh-CN': '由专人访谈录音或提供零碎素材，AI 旗舰总编纂代理自动扩编成 25+ 页麦肯锡架构权威专书。',
      'en-US': 'Turn voice recordings and raw notes into a 25+ page structured authority book.',
      'ja-JP': 'インタビュー録音や手持ちのメモから、AI旗艦エージェントがマッキンゼー構造の25ページ超の本格権威書へ拡張編纂。',
      'vi-VN': 'Chuyển các ghi âm và ghi chú thô thành cuốn sách chuyên gia 25+ trang theo cấu trúc chuẩn McKinsey.',
      'id-ID': 'Ubah rekaman suara dan catatan mentah menjadi buku otoritas terstruktur 25+ halaman berstandar McKinsey.'
    } as Record<string, string>)[lang] || 'Turn voice recordings into a 25+ page structured authority book.',

    b2Title: ({
      'zh-TW': '🎨 品牌專屬 CIS 排版',
      'zh-CN': '🎨 品牌专属 CIS 排版',
      'en-US': '🎨 Custom CIS Typography',
      'ja-JP': '🎨 ブランド独自 CIS 組版',
      'vi-VN': '🎨 Thiết kế Dàn trang Chuẩn CIS',
      'id-ID': '🎨 Tata Letak Khusus CIS Merek'
    } as Record<string, string>)[lang] || '🎨 Custom CIS Typography',
    b2Desc: ({
      'zh-TW': '精美商業圖解、權威來源文獻、專屬導流 QR Code 與高解析 HTML/PDF 雙格式精裝封裝。',
      'zh-CN': '精美商业图解、权威来源文献、专属导流 QR Code 与高解析 HTML/PDF 双格式精装封装。',
      'en-US': 'Premium business diagrams, citation references, custom QR funnels, and dual PDF/HTML assets.',
      'ja-JP': '洗練されたビジネス図解、学術的参考文献、専用QRコード導線、高解像度HTML/PDFの装丁パッケージ。',
      'vi-VN': 'Sơ đồ kinh doanh cao cấp, tài liệu trích dẫn uy tín, mã QR điều hướng và định dạng PDF/HTML sắc nét.',
      'id-ID': 'Diagram bisnis premium, referensi sitasi tepercaya, corong QR khusus, dan aset ganda PDF/HTML.'
    } as Record<string, string>)[lang] || 'Premium business diagrams and dual PDF/HTML assets.',

    b3Title: ({
      'zh-TW': '🌐 多語系全球佈署',
      'zh-CN': '🌐 多语系全球部署',
      'en-US': '🌐 Multilingual Deploy',
      'ja-JP': '🌐 多言語グローバル展開',
      'vi-VN': '🌐 Triển khai Đa ngôn ngữ Toàn cầu',
      'id-ID': '🌐 Penerapan Multibahasa Global'
    } as Record<string, string>)[lang] || '🌐 Multilingual Deploy',
    b3Desc: ({
      'zh-TW': '支援繁中/英、日/英、繁中/日自選語系對，獨立上傳至 Cloudflare R2 雙鏡像高速節點。',
      'zh-CN': '支援繁中/英、日/英、繁中/日自选语系对，独立上传至 Cloudflare R2 双镜像高速节点。',
      'en-US': 'Deploy in Traditional Chinese, English, or Japanese to dedicated high-speed Cloudflare R2.',
      'ja-JP': '繁体字/英語、日本語/英語、繁体字/日本語の言語ペアに対応し、Cloudflare R2 高速ノードへ独立公開。',
      'vi-VN': 'Hỗ trợ các cặp ngôn ngữ Trung/Anh, Nhật/Anh, Trung/Nhật lưu trữ trên Cloudflare R2 tốc độ cao.',
      'id-ID': 'Mendukung pasangan bahasa Mandarin/Inggris, Jepang/Inggris, Mandarin/Jepang pada Cloudflare R2 berkecepatan tinggi.'
    } as Record<string, string>)[lang] || 'Deploy to dedicated high-speed Cloudflare R2.',

    b4Title: ({
      'zh-TW': '🎬 4K 雙主播短影音協播',
      'zh-CN': '🎬 4K 双主播短影音协播',
      'en-US': '🎬 4K Dual-Anchor Ads',
      'ja-JP': '🎬 4K ダブルアナウンサー連動広告',
      'vi-VN': '🎬 Quảng bá Video 4K Song phát thanh viên',
      'id-ID': '🎬 Iklan Video 4K Dual-Anchor'
    } as Record<string, string>)[lang] || '🎬 4K Dual-Anchor Ads',
    b4Desc: ({
      'zh-TW': '無縫接軌 t6/t7/t8 短影音矩陣產線，每日在 TikTok/YouTube 等社群幫您專書打廣告找客人！',
      'zh-CN': '无缝接轨 t6/t7/t8 短影音矩阵产线，每日在 TikTok/YouTube 等社群帮您专书打广告找客人！',
      'en-US': 'Integrate directly with t6/t7/t8 short video pipeline to promote your book daily on TikTok/YouTube.',
      'ja-JP': 't6/t7/t8 短尺動画パイプラインとシームレスに連動し、TikTokやYouTubeであなたの書籍を毎日自動プロモーション！',
      'vi-VN': 'Tích hợp trực tiếp dây chuyền video ngắn t6/t7/t8 để quảng bá sách hàng ngày trên TikTok/YouTube!',
      'id-ID': 'Terintegrasi langsung dengan pipa video pendek t6/t7/t8 untuk mempromosikan buku Anda setiap hari di TikTok/YouTube!'
    } as Record<string, string>)[lang] || 'Promote your book daily on TikTok/YouTube!',

    chatQuery: ({
      'zh-TW': '您好，我想諮詢「企業名家・AI 電子書一條龍客製化委託」方案（$2,000~$5,000 USD），請為我說明服務內容與流程！',
      'zh-CN': '您好，我想咨询“企业名家・AI 电子书一条龙客制化委托”方案（$2,000~$5,000 USD），请为我说明服务内容与流程！',
      'en-US': 'Hello, I would like to inquire about the Enterprise VIP Bespoke E-Book Custom Service ($2,000~$5,000 USD).',
      'ja-JP': 'こんにちは、「企業・名家向けAI電子書籍ワンストップ完全代行受託」プラン（$2,000〜$5,000 USD）について、サービス内容と流れを教えてください！',
      'vi-VN': 'Xin chào, tôi muốn tìm hiểu về Gói Sản xuất E-Book Trọn gói Cao cấp ($2,000~$5,000 USD).',
      'id-ID': 'Halo, saya ingin menanyakan tentang Layanan Kustom E-Book Perusahaan VIP ($2,000~$5,000 USD).'
    } as Record<string, string>)[lang] || 'Hello, I would like to inquire about the Enterprise VIP Bespoke E-Book Custom Service.',

    consultChatBtn: ({
      'zh-TW': '💬 一鍵喚起 AI 客服洽詢客製方案',
      'zh-CN': '💬 一键唤起 AI 客服洽询客制方案',
      'en-US': '💬 Consult AI Support for Bespoke Plan',
      'ja-JP': '💬 AIサポートでカスタム相談',
      'vi-VN': '💬 Chat với AI để Tư vấn Gói Riêng',
      'id-ID': '💬 Konsultasi AI untuk Paket Khusus'
    } as Record<string, string>)[lang] || '💬 Consult AI Support for Bespoke Plan',
    contactLineBtn: ({
      'zh-TW': '📱 直接聯繫總工程師 CTO SEN (Line: xyz007tw)',
      'zh-CN': '📱 直接联系总工程师 CTO SEN (Line: xyz007tw)',
      'en-US': '📱 Contact CTO SEN Directly (Line: xyz007tw)',
      'ja-JP': '📱 チーフエンジニア CTO SEN に直接連絡 (Line: xyz007tw)',
      'vi-VN': '📱 Liên hệ Trực tiếp CTO SEN (Line: xyz007tw)',
      'id-ID': '📱 Hubungi CTO SEN Langsung (Line: xyz007tw)'
    } as Record<string, string>)[lang] || '📱 Contact CTO SEN Directly (Line: xyz007tw)',
    emailUsBtn: ({
      'zh-TW': '✉️ Email 來信諮詢 (xyz007tw@gmail.com)',
      'zh-CN': '✉️ Email 来信咨询 (xyz007tw@gmail.com)',
      'en-US': '✉️ Email Us (xyz007tw@gmail.com)',
      'ja-JP': '✉️ メールで問い合わせ (xyz007tw@gmail.com)',
      'vi-VN': '✉️ Gửi Email Tư vấn (xyz007tw@gmail.com)',
      'id-ID': '✉️ Email Kami (xyz007tw@gmail.com)'
    } as Record<string, string>)[lang] || '✉️ Email Us (xyz007tw@gmail.com)',

    // Main bottom action buttons
    join990Btn: ({
      'zh-TW': '🚀 立即認購 $990 開設知識販賣機 (含3本書+AI廣告+100%倒抵)',
      'zh-CN': '🚀 立即认购 $990 开设知识贩卖机 (含3本书+AI广告+100%倒抵)',
      'en-US': '🚀 Join $990 Plan: Launch Your Vending Machine (3 Books + AI Ads)',
      'ja-JP': '🚀 今すぐ$990で知識の自販機を開設 (書籍3冊分+AI広告+100%相殺)',
      'vi-VN': '🚀 Đăng ký Gói $990 Mở Máy Bán Tri Thức (3 Sách + AI Ads + Hoàn 100%)',
      'id-ID': '🚀 Buka Mesin Penjual $990 Sekarang (3 Buku + Iklan AI + 100% Potongan)'
    } as Record<string, string>)[lang] || '🚀 Join $990 Plan: Launch Your Vending Machine (3 Books + AI Ads)',
    enterStudioBtn: ({
      'zh-TW': '🛠️ 進入「知識自動販賣機 創作工作台 (/studio)」',
      'zh-CN': '🛠️ 进入“知识自动贩卖机 创作工作台 (/studio)”',
      'en-US': '🛠️ Open Knowledge Vending Machine Studio (/studio)',
      'ja-JP': '🛠️ 「知識の自販機 制作スタジオ (/studio)」へ',
      'vi-VN': '🛠️ Vào Xưởng Sáng tạo Máy Bán Tri thức (/studio)',
      'id-ID': '🛠️ Buka Studio Mesin Penjual Pengetahuan (/studio)'
    } as Record<string, string>)[lang] || '🛠️ Open Knowledge Vending Machine Studio (/studio)',
    gotoEbookStoreBtn: ({
      'zh-TW': '📖 前往「讀者 VIP 訂閱書櫃 (/ebook-store)」',
      'zh-CN': '📖 前往“读者 VIP 订阅书柜 (/ebook-store)”',
      'en-US': '📖 Reader VIP Bookstore (/ebook-store)',
      'ja-JP': '📖 「VIP読者本棚 (/ebook-store)」へ',
      'vi-VN': '📖 Đến Kệ sách VIP Độc giả (/ebook-store)',
      'id-ID': '📖 Kunjungi Toko Buku VIP (/ebook-store)'
    } as Record<string, string>)[lang] || '📖 Reader VIP Bookstore (/ebook-store)',
    askAiBtn: ({
      'zh-TW': '💬 諮詢 AI 客服了解販賣機細節',
      'zh-CN': '💬 咨询 AI 客服了解贩卖机细节',
      'en-US': '💬 Ask AI About Knowledge Vending Machines',
      'ja-JP': '💬 AIサポートに自販機の詳細を相談',
      'vi-VN': '💬 Hỏi AI về Máy Bán Tri thức',
      'id-ID': '💬 Tanya AI Tentang Mesin Penjual'
    } as Record<string, string>)[lang] || '💬 Ask AI About Knowledge Vending Machines'
  };

  return (
    <section id="author-coop" className="w-full max-w-7xl px-4 sm:px-6 py-16 scroll-mt-24">
      <div className="bg-gradient-to-br from-purple-950/70 via-indigo-950/80 to-pink-950/60 border border-pink-500/40 rounded-3xl p-6 sm:p-8 md:p-14 relative overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.18)]">
        {/* 背景裝飾光暈 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* 頂部徽章 */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-xs sm:text-sm font-bold mb-6">
            <span>{t.topBadge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-5 tracking-tight text-white drop-shadow-lg leading-tight">
            {t.heroTitle}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-pink-200/90 mb-10 max-w-4xl mx-auto leading-relaxed">
            {t.heroSub}
          </p>
        </div>

        {/* 四大核心商業規則卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 text-left">
          {/* 卡片 1 */}
          <div className="bg-white/5 border border-pink-500/30 hover:border-pink-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                🔥
              </div>
              <h3 className="text-lg font-black text-white mb-2">{t.c1Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.c1Desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-pink-400">
              {t.c1Tag}
            </div>
          </div>

          {/* 卡片 2 */}
          <div className="bg-white/5 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                💎
              </div>
              <h3 className="text-lg font-black text-white mb-2">{t.c2Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.c2Desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-emerald-400">
              {t.c2Tag}
            </div>
          </div>

          {/* 卡片 3 */}
          <div className="bg-white/5 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                🔄
              </div>
              <h3 className="text-lg font-black text-white mb-2">{t.c3Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.c3Desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-cyan-400">
              {t.c3Tag}
            </div>
          </div>

          {/* 卡片 4 */}
          <div className="bg-white/5 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1">
            <div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-2xl mb-4 shadow-lg">
                ⚖️
              </div>
              <h3 className="text-lg font-black text-amber-300 mb-2">{t.c4Title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{t.c4Desc}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-amber-400">
              {t.c4Tag}
            </div>
          </div>
        </div>

        {/* 事前公開醒目警示框 */}
        <div className="bg-red-950/40 border-2 border-red-500/50 rounded-2xl p-5 sm:p-6 mb-10 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-400/50 text-red-300 text-xs font-black mb-2">
                {t.noticeBadge}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white">
                {t.noticeHead}
              </h4>
            </div>
            <button
              onClick={() => setShowBannedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-400 text-red-200 font-bold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
            >
              {t.viewBannedBtn}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-3">
            {t.noticeSummary}
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30 text-xs sm:text-sm text-amber-300 font-bold">
            {t.noticeWarningBox}
          </div>
        </div>

        {/* 企業名家・AI 電子書一條龍客製化委託專區 (Enterprise Bespoke High-Ticket Service) */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-indigo-950/50 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 md:p-10 mb-10 text-left shadow-[0_0_50px_rgba(251,191,36,0.15)] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <span>{t.bespokeBadge}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                {t.bespokeTitle}
              </h3>
              <p className="text-xs sm:text-base text-amber-100/80 mt-2 max-w-4xl leading-relaxed">
                {t.bespokeSub}
              </p>
            </div>
            <div className="shrink-0 bg-amber-500/10 border border-amber-400/40 rounded-2xl p-4 text-center">
              <span className="text-xs text-amber-300 font-bold block">{t.budgetLabel}</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 block">$2,000 ~ $5,000</span>
              <span className="text-[11px] text-gray-400 block mt-0.5">{t.budgetDesc}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-black text-sm mb-1.5 flex items-center gap-2">
                <span>{t.b1Title}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.b1Desc}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-black text-sm mb-1.5 flex items-center gap-2">
                <span>{t.b2Title}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.b2Desc}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-black text-sm mb-1.5 flex items-center gap-2">
                <span>{t.b3Title}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.b3Desc}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-amber-400 font-black text-sm mb-1.5 flex items-center gap-2">
                <span>{t.b4Title}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {t.b4Desc}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-amber-400/20">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(
                    new CustomEvent('open-ai-chat', {
                      detail: { query: t.chatQuery }
                    })
                  );
                }
              }}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-105 cursor-pointer"
            >
              {t.consultChatBtn}
            </button>

            <a
              href="https://line.me/ti/p/~xyz007tw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400 text-emerald-200 font-bold text-sm transition-all hover:scale-105"
            >
              {t.contactLineBtn}
            </a>

            <a
              href="mailto:xyz007tw@gmail.com?subject=諮詢企業名家AI電子書一條龍客製委託"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all"
            >
              {t.emailUsBtn}
            </a>
          </div>
        </div>

        {/* 四大功能快速入口與加盟結帳按鈕 */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openJoinModal('YEAR1_990')}
            className="w-full lg:w-auto px-7 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl text-base sm:text-lg font-black transition-all shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 cursor-pointer"
          >
            {t.join990Btn}
          </button>

          <Link
            href="/studio"
            className="w-full lg:w-auto px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-400/50 text-cyan-200 rounded-xl text-base font-bold transition-all hover:scale-105 text-center"
          >
            {t.enterStudioBtn}
          </Link>

          <Link
            href="/ebook-store"
            className="w-full lg:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-base font-bold transition-all hover:scale-105 text-center"
          >
            {t.gotoEbookStoreBtn}
          </Link>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('open-ai-chat', {
                    detail: {
                      query: '我想了解「知識自動販賣機 AI-ATM」首年 $990 方案（含3台專書自販機、AI打廣告、3~7天書審與禁書條款）'
                    }
                  })
                );
              }
            }}
            className="w-full lg:w-auto px-5 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            {t.askAiBtn}
          </button>
        </div>
      </div>

      {/* 彈窗 1：完整全球 10 大禁書條款明細 */}
      {showBannedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-red-500/50 rounded-3xl max-w-4xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">GLOBAL PUBLISHING COMPLIANCE</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {lang === 'ja-JP'
                    ? '🚫 世界電子書籍 登録不可の「10大禁止図書基準」と違反時返金不可鉄則'
                    : lang === 'zh-CN'
                    ? '🚫 全球电子书不可上架之“10 大禁书种类”与违规不退费铁律'
                    : lang === 'vi-VN'
                    ? '🚫 10 Danh Mục E-Book Bị Cấm Toàn Cầu & Chính Sách Không Hoàn Tiền'
                    : lang === 'id-ID'
                    ? '🚫 10 Kategori E-Book Terlarang Global & Kebijakan Non-Refund'
                    : '🚫 全球電子書不可上架之「10 大禁書種類」與違規不退費鐵律'}
                </h3>
              </div>
              <button
                onClick={() => setShowBannedModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold cursor-pointer"
              >
                ✕ {lang === 'ja-JP' ? '閉じる' : lang.includes('zh') ? '關閉' : 'Close'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {GLOBAL_BANNED_BOOK_CATEGORIES.map(cat => {
                const catTitle =
                  lang === 'ja-JP' ? cat.title_ja || cat.title_en :
                  lang === 'zh-CN' ? cat.title_zh :
                  lang === 'en-US' ? cat.title_en : cat.title_zh;
                const catDesc =
                  lang === 'ja-JP' ? cat.desc_ja || cat.desc_en :
                  lang === 'zh-CN' ? cat.desc_zh :
                  lang === 'en-US' ? cat.desc_en : cat.desc_zh;

                return (
                  <div key={cat.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-bold text-red-300 text-sm mb-1">
                      {cat.icon} {catTitle}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {catDesc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-xs sm:text-sm text-red-200 leading-relaxed mb-6">
              <strong>⚖️ {lang === 'ja-JP' ? '違反時の措置と返金不可誓約：' : '違規處理與零退費切結聲明：'}</strong><br />
              {lang === 'ja-JP' ? (
                <>
                  1. すべての電子書籍は、完成後に管理システムにて <strong>3〜7営業日の人間およびAI二重審査</strong> が実施されます。<br />
                  2. 「審査通過後の不正内容への改ざん」、「フィッシングQRコードの埋め込み」、「不正マネーロンダリング」は固く禁止します。<br />
                  3. お支払い前に上記規約を十分にご理解ください。<strong>決済完了後、禁止図書規定への違反や通報が確認された場合、即座に出品停止およびアカウント永久凍結となり、支払済みの料金は一切返金されません！</strong>
                </>
              ) : (
                <>
                  1. 所有電子書設定完成後，均須進入總管理後台進行 <strong>3~7 個工作天之人工與 AI 雙重書審</strong>。<br />
                  2. 嚴禁「掛羊頭賣狗肉（審核後偷換違規內容）」、「植入釣魚木馬 QR Code」或「洗錢刷單」。<br />
                  3. 加盟商於付款前須充分知悉上述規範，<strong>一旦付款開通後，若因違反上述禁書條款或遭讀者/第三方檢舉查證屬實，平台將立即強制下架並永久凍結帳號，已支付之 $990 / $360 / $450 款項一律不予退費！</strong>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBannedModal(false);
                  openJoinModal('YEAR1_990');
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm cursor-pointer"
              >
                {lang === 'ja-JP' ? '内容を理解しました・加盟プラン申し込みへ' : '我已清楚了解・前往認購加盟方案'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彈窗 2：付款前強制勾選「禁書條款不退費 ＋ 3~7天書審」結帳視窗 */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-pink-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start gap-4 mb-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-bold text-pink-400">STEP 1: PRE-PAYMENT AGREEMENT</span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {lang === 'ja-JP'
                    ? '📋 加盟店決済前の確認誓約書＆プラン確認'
                    : lang === 'zh-CN'
                    ? '📋 加盟商付款前必读切结书与方案确认'
                    : '📋 加盟商付款前必讀切結書与方案確認'}
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 方案切換器 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
              <button
                onClick={() => setCheckoutPlan('YEAR1_990')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'YEAR1_990'
                    ? 'bg-pink-500/20 border-pink-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                🔥 {lang === 'ja-JP' ? '初年度加盟 $990' : '首年加盟 $990'}<br />
                <span className="text-[11px] font-normal opacity-80">
                  {lang === 'ja-JP' ? '3冊枠+AI広告+100%相殺' : '含3本書+AI廣告+100%倒抵'}
                </span>
              </button>
              <button
                onClick={() => setCheckoutPlan('ADD_BOOK_360')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'ADD_BOOK_360'
                    ? 'bg-purple-500/20 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                ➕ {lang === 'ja-JP' ? '4冊目以降追加 $360' : '加購第4本書起 $360'}<br />
                <span className="text-[11px] font-normal opacity-80">
                  {lang === 'ja-JP' ? '1冊追加ごとの開発費' : '每增 1 本電子書開發費'}
                </span>
              </button>
              <button
                onClick={() => setCheckoutPlan('YEAR2_RENEW_450')}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  checkoutPlan === 'YEAR2_RENEW_450'
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                🔄 {lang === 'ja-JP' ? '次年度保守更新 $450' : '次年系統服務續約 $450'}<br />
                <span className="text-[11px] font-normal opacity-80">
                  {lang === 'ja-JP' ? 'AI広告+システム(100%相殺)' : 'AI廣告+系統服務(同享100%倒抵)'}
                </span>
              </button>
            </div>

            {/* 強制勾選切結框 */}
            <div className="space-y-3 bg-black/50 border border-red-500/30 rounded-2xl p-4 mb-6 text-xs sm:text-sm">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedBannedTerms}
                  onChange={e => setAgreedBannedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-pink-500 shrink-0"
                />
                <span className="text-gray-200 leading-relaxed">
                  {lang === 'ja-JP' ? (
                    <>
                      <strong>【禁止図書・規約違反返金不可誓約】</strong>本人已詳閱《世界10大禁止図書基準》（わいせつ・未成年者不適切コンテンツ、兵器暴力、薬物、賭博詐欺資金洗浄、無許可金融、誇大医療、著作権侵害、プライバシー侵害中傷、ヘイトスピーチ、フィッシング空書籍の禁止）を精読し同意しました。<strong>決済完了後、禁止規定への違反や通報が確認された場合、アカウントが即時停止され、支払済み料金は一切返金されないことを完全に理解しました。</strong>
                    </>
                  ) : (
                    <>
                      <strong>【禁書與違規不退費切結】</strong>本人已詳閱《全球 10 大不可上架禁書規範》（嚴禁色情猥褻/未成年不當內容、暴力武器、毒品、賭博詐騙洗錢、非法吸金資金盤、誇大醫療偏方、盜版侵權、侵犯隱私誹謗、仇恨危害國安、釣魚木馬空殼書）。本人清楚了解：<strong>付款後若違反禁書規定或遭檢舉查證屬實，平台將強制下架封號，且已付款項一律不退費！</strong>
                    </>
                  )}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none pt-2 border-t border-white/10">
                <input
                  type="checkbox"
                  checked={agreedReviewDays}
                  onChange={e => setAgreedReviewDays(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-pink-500 shrink-0"
                />
                <span className="text-gray-200 leading-relaxed">
                  {lang === 'ja-JP' ? (
                    <>
                      <strong>【クォータ・30回修正上限・手数料（10%システム費+25%アフィリエイト）および3〜7日審査の承諾】</strong>本人了解 $990 プランに3冊分の開発枠が含まれること（4冊目以降は1冊$360）、<strong>各書籍の無料修正回数は30回（完成後の再修正を含む。超過時は$30で1回追加修正可能）</strong>、次年度のAI集客およびシステム保守費は$450であること；売上ごとに<strong>10%のシステム費（$990/$450枠から100%相殺可能）</strong>と<strong>25%のアフィリエイト手数料</strong>が発生すること；且つ<strong>完成後に3〜7営業日の審査を経て公開されること</strong>を理解し同意します。
                    </>
                  ) : (
                    <>
                      <strong>【配額、30次修改上限、雙軌服務費（10%系統費+25%推廣聯盟費）與 3~7 天書審認知】</strong>本人了解 $990 方案含開發 3 本電子書（之後每本開發費 $360），<strong>每本電子書免費修改次數為 30 次（含完稿後再修改，超過後需支付修改費 $30 才可再修改 1 次）</strong>，次年 AI 自來客及電子書系統服務費為 $450；每筆交易除 <strong>1 成 (10%) 系統服務費（含提款服務費及推廣服務費，可由首年 $990 / 次年 $450 抵用金 100% 倒抵）</strong>外，另需支出 <strong>「推廣聯盟服務費 25%」</strong>；且<strong>電子書設定完成後須進入管理後台進行「書審（時間 3~7 天）」</strong>通過後方可正式上架。
                    </>
                  )}
                </span>
              </label>
            </div>

            {/* 結帳按鈕區 */}
            {!agreedBannedTerms || !agreedReviewDays ? (
              <div className="p-4 rounded-xl bg-gray-800 border border-gray-700 text-center text-amber-400 text-sm font-bold">
                {lang === 'ja-JP'
                  ? '☝️ 上記2点の「事前確認誓約事項」にチェックを入れると、クレジットカード / USDT 決済ボタンがアンロックされます'
                  : '☝️ 請先勾選上方兩項「付款前必讀合規切結條款」，即可解鎖信用卡 / USDT 付款按鈕'}
              </div>
            ) : (
              <div className="space-y-4">
                <PayUniButton
                  packageId={990}
                  priceInUSDT={planPrice}
                  productType="NFT_REDEEM"
                  productName={getPlanName(checkoutPlan)}
                />
                <p className="text-center text-xs text-gray-400">
                  {lang === 'ja-JP' ? (
                    <>お支払い完了後、<Link href="/studio" className="text-cyan-400 underline font-bold">/studio 加盟店スタジオ</Link> からすぐに電子書籍の制作・ダウンロードを開始できます！</>
                  ) : (
                    <>付款完成後，即可直接進入 <Link href="/studio" className="text-cyan-400 underline font-bold">/studio 加盟商工作台</Link> 開始創作與下載電子書！</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
