import crypto from 'crypto';

export const PAYUNI_MERCHANT_ID = process.env.PAYUNI_MERCHANT_ID || '';
export const PAYUNI_HASH_KEY = process.env.PAYUNI_HASH_KEY || '';
export const PAYUNI_IV_KEY = process.env.PAYUNI_IV_KEY || '';
export const PAYUNI_API_URL = 'https://api.payuni.com.tw/api/upp'; // Production URL

export function encryptTradeInfo(data: Record<string, any>): string {
  const urlEncodedData = new URLSearchParams(data).toString();
  const cipher = crypto.createCipheriv('aes-256-cbc', PAYUNI_HASH_KEY, PAYUNI_IV_KEY);
  let encrypted = cipher.update(urlEncodedData, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptTradeInfo(encryptedHex: string): Record<string, any> {
  const decipher = crypto.createDecipheriv('aes-256-cbc', PAYUNI_HASH_KEY, PAYUNI_IV_KEY);
  decipher.setAutoPadding(false);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  // Remove padding (PKCS7)
  const paddingLength = decrypted.charCodeAt(decrypted.length - 1);
  if (paddingLength > 0 && paddingLength <= 32) {
    decrypted = decrypted.substring(0, decrypted.length - paddingLength);
  }
  
  // Parse URL encoded string to object
  const params = new URLSearchParams(decrypted);
  const result: Record<string, any> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

export function generateTradeSha(encryptedData: string): string {
  const str = `HashKey=${PAYUNI_HASH_KEY}&${encryptedData}&HashIV=${PAYUNI_IV_KEY}`;
  return crypto.createHash('sha256').update(str).digest('hex').toUpperCase();
}
