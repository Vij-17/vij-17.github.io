# Personal website

Built with [Astro](https://astro.build), React, Tailwind CSS and Motion. Deployed free on GitHub Pages.

## 1. Run it on your computer

You need **Node.js 22 or newer** (download the LTS installer from nodejs.org).

```bash
cd portfolio
npm install        # first time only
npm run dev        # opens a live preview at http://localhost:4321
```

The preview reloads automatically every time you save a file. Stop it with `Ctrl + C`.

## 2. Where to edit things

| What you want to change | File |
| --- | --- |
| Name, intro sentence, email, LinkedIn, GitHub, rotating words | `src/site.config.ts` |
| Education and research timeline | `src/site.config.ts` (the `path` list) |
| Research interests | `src/pages/research.astro` (the `interests` list) |
| Skills and languages | `src/pages/cv.astro` |
| A project | `src/content/projects/*.md` (one file per project) |
| A blog post | `src/content/blog/*.md` (one file per post) |
| A paper for the reading list | `src/content/reading/*.md` (one file per paper) |
| Your CV PDF | put it at `public/cv.pdf`, then set `cvPdf: '/cv.pdf'` in `src/site.config.ts` |
| Images | put them in `public/images/` and link as `/images/name.png` |
| Colours and fonts | `src/styles/global.css` (the `@theme` block) |

### Adding a blog post

Create `src/content/blog/my-post-title.md`:

```markdown
---
title: My post title
date: 2026-11-20
summary: One sentence shown in the list of posts.
---

Write the post here in Markdown.
```

The file name becomes the address: `/writing/my-post-title`. Add `draft: true` to keep a post off the live site while you work on it. Delete `first-post.md` once you have a real post.

### Adding a paper to the reading list

Create `src/content/reading/author-year-topic.md` with `title`, `authors`, `venue`, `year`, `url` and `added` (copy an existing file), then write your note underneath.

## 3. Publishing (GitHub Pages)

The site lives in the repository `Vij-17/vij-17.github.io` and is published at **https://vij-17.github.io**.

- One-time setting: on GitHub, open the repository → **Settings → Pages** → set **Source** to **GitHub Actions**.
- After that, every push to `main` rebuilds and republishes the site automatically (watch the **Actions** tab for the green tick).

## 4. Adding components from cuicui.day

1. Open a component on [cuicui.day](https://cuicui.day), copy its React code into `src/components/ui/ComponentName.tsx`.
2. Install any packages it lists (most need only `motion`, which is already installed).
3. Use it in a page: `import ComponentName from '../components/ui/ComponentName.tsx';` then `<ComponentName client:visible />`.
   The `client:visible` part is what makes it interactive; without it, React components render as static HTML.

cuicui is MIT-licensed: keep a note of the source at the top of each copied file.

The theme colours are available as Tailwind classes, for example `bg-surface`, `bg-surface-raised`, `border-line`, `text-fg`, `text-fg-muted`, `text-sky`, `text-violet`, `text-orange` and `font-display`.

## How the hero background works

`src/components/NeuralBoard.tsx` runs **Brian's Brain**, a three-state cellular automaton: a ready cell fires when exactly two neighbours are firing, then passes through a refractory state before it can fire again. Two additions keep it calm: rare spontaneous firing launches new waves when the board is quiet, and a homeostatic rule suppresses new firing once about 2% of cells are active. Visitors stimulate it with the pointer. It pauses when scrolled out of view and shows a static frame for people who have reduced motion turned on.
