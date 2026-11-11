import { createClient } from '@supabase/supabase-js';
import { BlogPost, SEED_BLOG_POSTS } from './blogEngine';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key'
);

// 使用 packages 表中特殊保留 ID (990991) 的 roi_text 欄位作為免 SQL 遷移的高可用雲端 Blog JSON Store
const BLOG_STORE_PKG_ID = 990991;
const BLOG_STORE_PREFIX = '__WX_BLOG_STORE__:';

export interface BlogCloudStore {
  custom_posts: BlogPost[];
  updated_at: string;
}

const CACHE_TTL_MS = 120 * 1000;
let cachedPosts: BlogPost[] | null = null;
let cachedAt = 0;

export async function loadAllBlogPosts(bypassCache = false): Promise<BlogPost[]> {
  if (!bypassCache && cachedPosts && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedPosts;
  }

  let customPosts: BlogPost[] = [];
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', BLOG_STORE_PKG_ID)
      .single();

    if (!error && data && typeof data.roi_text === 'string' && data.roi_text.startsWith(BLOG_STORE_PREFIX)) {
      const parsed: BlogCloudStore = JSON.parse(data.roi_text.slice(BLOG_STORE_PREFIX.length));
      if (parsed && Array.isArray(parsed.custom_posts)) {
        customPosts = parsed.custom_posts;
      }
    }
  } catch {
    // Fallback to seed posts if offline or placeholder
  }

  // Merge custom daily posts with seed posts (deduplicating by slug, customPosts take precedence)
  const map = new Map<string, BlogPost>();
  for (const post of customPosts) {
    if (post && post.slug) {
      map.set(post.slug, post);
    }
  }
  for (const seed of SEED_BLOG_POSTS) {
    if (!map.has(seed.slug)) {
      map.set(seed.slug, seed);
    }
  }

  const sorted = Array.from(map.values()).sort((a, b) =>
    (b.published_at || '').localeCompare(a.published_at || '')
  );
  cachedPosts = sorted;
  cachedAt = Date.now();
  return sorted;
}

export async function saveDailyBlogPost(newPost: BlogPost): Promise<BlogPost[]> {
  let customPosts: BlogPost[] = [];
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('roi_text')
      .eq('id', BLOG_STORE_PKG_ID)
      .single();

    if (!error && data && typeof data.roi_text === 'string' && data.roi_text.startsWith(BLOG_STORE_PREFIX)) {
      const parsed: BlogCloudStore = JSON.parse(data.roi_text.slice(BLOG_STORE_PREFIX.length));
      if (parsed && Array.isArray(parsed.custom_posts)) {
        customPosts = parsed.custom_posts;
      }
    }
  } catch {
    // Ignore read error
  }

  // Upsert by slug and keep most recent 120 daily posts in cloud store to stay lightweight
  const filtered = customPosts.filter((p) => p.slug !== newPost.slug);
  const updatedCustomPosts = [newPost, ...filtered].slice(0, 120);

  const storePayload: BlogCloudStore = {
    custom_posts: updatedCustomPosts,
    updated_at: new Date().toISOString(),
  };

  try {
    await supabase.from('packages').upsert(
      {
        id: BLOG_STORE_PKG_ID,
        name_zh: '__SYSTEM_BLOG_STORE__',
        name_en: '__SYSTEM_BLOG_STORE__',
        amount: 1,
        price: 990,
        discount_text: 'SYSTEM_BLOG_STORE',
        roi_text: BLOG_STORE_PREFIX + JSON.stringify(storePayload),
        is_active: false,
      },
      { onConflict: 'id' }
    );
  } catch (e) {
    console.error('[BlogStore] Failed to save daily blog post to Supabase:', e);
  }

  cachedPosts = null;
  cachedAt = 0;
  return loadAllBlogPosts(true);
}
