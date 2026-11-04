import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts: one Markdown file per post in src/content/blog/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // Drafts appear when you run `npm run dev` but are left out of the live site.
    draft: z.boolean().default(false),
  }),
});

// Reading list: one Markdown file per paper or article in src/content/reading/
// The body of the file is your note on why it is worth reading.
const reading = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reading' }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    url: z.url(),
    added: z.coerce.date(),
  }),
});

// Projects: one Markdown file per project in src/content/projects/
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    period: z.string(),
    summary: z.string(),
    tools: z.array(z.string()).default([]),
    order: z.number().default(99),
  }),
});

export const collections = { blog, reading, projects };
