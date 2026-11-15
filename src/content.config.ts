import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    status: z.enum(['active', 'completed', 'research']),
    verification: z.enum(['verified', 'needs-review']).default('needs-review'),
    featured: z.boolean().default(false),
    order: z.number().int().nonnegative(),
    disciplines: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).default([]),
    repository: z.url().optional(),
    externalUrl: z.url().optional(),
    heroImage: z.string().optional(),
    published: z.boolean().default(false),
  }),
});

export const collections = { projects };
