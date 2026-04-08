import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional().default(new Date('2020-01-01')),
    draft: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    section: z.string().optional(),
    coverImage: z.string().optional(),
    coverEyebrow: z.string().optional(),
    coverTitle: z.string().optional(),
  }),
});

export const collections = { posts, pages };
