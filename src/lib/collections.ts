import { getCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_IMAGES_DIR = join(process.cwd(), 'public/images/posts');

const extractFirstPostImageFromBody = (body: string): string | null => {
  const candidates: string[] = [];

  const md = body.match(/!\[[^\]]*]\((\/images\/posts\/[^)\s]+)\)/i);
  if (md?.[1]) candidates.push(md[1]);

  const html = body.match(/<img[^>]+src=["'](\/images\/posts\/[^"']+)["']/i);
  if (html?.[1]) candidates.push(html[1]);

  for (const url of candidates) {
    const clean = url.split('?')[0].split('#')[0];
    const filename = clean.split('/').pop();
    if (!filename) continue;
    const decoded = decodeURIComponent(filename);
    if (existsSync(join(POSTS_IMAGES_DIR, decoded))) return decoded;
  }

  return null;
};

export const getPublishedPosts = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map((post) => {
      const current = post.data.coverImage;
      const currentIsValid = !!current && existsSync(join(POSTS_IMAGES_DIR, current));
      if (currentIsValid) return post;

      const derived = extractFirstPostImageFromBody(post.body ?? '');
      if (!derived) return post;

      return {
        ...post,
        data: {
          ...post.data,
          coverImage: derived,
        },
      };
    });
};

export const getPublishedPages = async () => {
  const pages = await getCollection('pages', ({ data }) => !data.draft);
  return pages;
};

export const getConventionPages = async () => {
  const pages = await getPublishedPages();
  return pages
    .filter((p) => p.data.section === 'convencion')
    .sort((a, b) => {
      const aNum = extractArticleNumber(a.id);
      const bNum = extractArticleNumber(b.id);
      return aNum - bNum;
    });
};

const extractArticleNumber = (slug: string): number => {
  if (slug.includes('preambulo')) return -1;
  if (slug.includes('convencion-naciones-unidas')) return -2;
  const match = slug.match(/articulo-(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
};

export const getAllCategories = async () => {
  const posts = await getPublishedPosts();
  const categoryMap = new Map<string, number>();
  for (const post of posts) {
    for (const cat of post.data.categories) {
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    }
  }
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getAllTags = async () => {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const POSTS_PER_PAGE = 12;
