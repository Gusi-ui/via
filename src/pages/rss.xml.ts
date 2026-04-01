import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '@/lib/collections';

export const GET = async (context: APIContext) => {
  const posts = await getPublishedPosts();

  return rss({
    title: 'OVIAndalucía - Oficina de Vida Independiente Andalucía',
    description: 'Últimas noticias y artículos de la Asociación de Vida Independiente Andalucía',
    site: context.site!,
    items: posts.slice(0, 50).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description || '',
      link: `/posts/${post.id}/`,
      categories: post.data.categories,
    })),
    customData: '<language>es</language>',
  });
};
