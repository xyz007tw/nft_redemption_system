import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { putObjectToDedicatedR2 } from '@/lib/r2Storage';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileData, fileName, fileType, packageId } = body;

    if (!fileData) {
      return NextResponse.json({ success: false, error: '請提供欲上傳的檔案資料 (fileData missing)' }, { status: 400 });
    }

    // 將 base64 轉為 Buffer
    const base64Content = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    const buffer = Buffer.from(base64Content, 'base64');

    const cleanName = fileName ? String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_') : 'material.pdf';
    const pkgFolder = packageId ? `pkg_${packageId}` : 'general';
    const r2Key = `courses/${pkgFolder}/${Date.now()}_${cleanName}`;
    const contentType = fileType || 'application/octet-stream';

    const uploadRes = await putObjectToDedicatedR2(r2Key, buffer, contentType);

    return NextResponse.json({
      success: true,
      primaryUrl: uploadRes.primaryUrl,
      mirrorUrl: uploadRes.mirrorUrl,
      uploadedToCloud: uploadRes.uploadedToCloud,
      r2Key,
      message: `✅ 電子書/教材檔案已成功上傳至專用 R2 儲存槽！`
    });
  } catch (error: any) {
    console.error('[Admin Package Upload Error]:', error);
    return NextResponse.json({ success: false, error: error.message || '上傳至 R2 失敗' }, { status: 500 });
  }
}
