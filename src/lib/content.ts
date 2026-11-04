import { getCollection } from 'astro:content';

/** Published blog posts, newest first. Drafts are included only in `npm run dev`. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Reading list, most recently added first. */
export async function getReading() {
  const items = await getCollection('reading');
  return items.sort((a, b) => b.data.added.valueOf() - a.data.added.valueOf());
}

/** Projects in the order set by the `order` field. */
export async function getProjects() {
  const items = await getCollection('projects');
  return items.sort((a, b) => a.data.order - b.data.order);
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
