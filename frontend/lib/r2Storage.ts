import crypto from 'crypto';

// 專用 Cloudflare R2 雙公開網域常數設定 (1.5208.uk & pub-2006e181b8544782b8d026affdaa34ab.r2.dev)
export const R2_PRIMARY_PUBLIC_DOMAIN = 'https://1.5208.uk';
export const R2_DEV_PUBLIC_DOMAIN = 'https://pub-2006e181b8544782b8d026affdaa34ab.r2.dev';

export const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID || '2ecef792d2c54e7d88cfd1f5184c117b';
export const CF_R2_BUCKET = process.env.CF_R2_BUCKET_NAME || 'aivideo';

/**
 * 透過原生 AWS Signature V4 將電子書母檔、教材檔案或圖片直接 PUT 上傳至專用 Cloudflare R2 儲存槽
 * 並同時回傳 https://1.5208.uk/... 與 https://pub-2006e181b8544782b8d026affdaa34ab.r2.dev/... 雙網址
 */
export async function putObjectToDedicatedR2(
  r2Key: string,
  bodyBuffer: Buffer,
  contentType: string
): Promise<{ primaryUrl: string; mirrorUrl: string; uploadedToCloud: boolean }> {
  const cleanKey = r2Key.replace(/^\/+/, '');
  const primaryUrl = `${R2_PRIMARY_PUBLIC_DOMAIN}/${cleanKey}`;
  const mirrorUrl = `${R2_DEV_PUBLIC_DOMAIN}/${cleanKey}`;

  const accessKeyId = process.env.CF_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CF_R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return { primaryUrl, mirrorUrl, uploadedToCloud: false };
  }

  try {
    const host = `${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const region = 'auto';
    const service = 's3';
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);
    const payloadHash = crypto.createHash('sha256').update(bodyBuffer).digest('hex');

    const canonicalUri = `/${CF_R2_BUCKET}/${cleanKey}`;
    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;
    const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date';
    const canonicalRequest = [
      'PUT',
      canonicalUri,
      '',
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const hmac = (key: Buffer | string, data: string) =>
      crypto.createHmac('sha256', key).update(data).digest();
    const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
    const kRegion = hmac(kDate, region);
    const kService = hmac(kRegion, service);
    const kSigning = hmac(kService, 'aws4_request');
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorizationHeader =
      `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res = await fetch(`https://${host}${canonicalUri}`, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
        'x-amz-content-sha256': payloadHash,
        'x-amz-date': amzDate,
        Authorization: authorizationHeader
      },
      body: new Uint8Array(bodyBuffer)
    });

    return { primaryUrl, mirrorUrl, uploadedToCloud: res.ok };
  } catch (e) {
    console.warn('[Dedicated R2 Upload] fallback:', e);
    return { primaryUrl, mirrorUrl, uploadedToCloud: false };
  }
}
