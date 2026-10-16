export interface PackageMeta {
  roi_display?: string;
  product_type?: string;
  course_link?: string | null;
  promo_html_zh?: string | null;
  promo_html_en?: string | null;
}

const META_PREFIX = '__WXMETA__:';

export function packPackageMeta(rawRoiText: string | undefined | null, meta: PackageMeta): string {
  const cleanRoi = rawRoiText && !rawRoiText.startsWith(META_PREFIX) ? rawRoiText : (meta.roi_display || '');
  // Only pack if we have course metadata or custom promo HTML or non-default product_type
  if (
    (meta.product_type && meta.product_type !== 'NFT_REDEEM') ||
    meta.course_link ||
    meta.promo_html_zh ||
    meta.promo_html_en
  ) {
    const payload: PackageMeta = {
      roi_display: cleanRoi,
      product_type: meta.product_type || 'NFT_REDEEM',
      course_link: meta.course_link || null,
      promo_html_zh: meta.promo_html_zh || null,
      promo_html_en: meta.promo_html_en || null,
    };
    return META_PREFIX + JSON.stringify(payload);
  }
  return cleanRoi;
}

export function unpackPackageRow(row: any): any {
  if (!row) return row;
  const copy = { ...row };
  if (typeof copy.roi_text === 'string' && copy.roi_text.startsWith(META_PREFIX)) {
    try {
      const parsed: PackageMeta = JSON.parse(copy.roi_text.slice(META_PREFIX.length));
      copy.roi_text = parsed.roi_display || '';
      if (!copy.product_type && parsed.product_type) copy.product_type = parsed.product_type;
      if (!copy.course_link && parsed.course_link) copy.course_link = parsed.course_link;
      if (!copy.promo_html_zh && parsed.promo_html_zh) copy.promo_html_zh = parsed.promo_html_zh;
      if (!copy.promo_html_en && parsed.promo_html_en) copy.promo_html_en = parsed.promo_html_en;
    } catch {
      // Ignore parse errors
    }
  }
  if (!copy.product_type) copy.product_type = 'NFT_REDEEM';
  return copy;
}
