/**
 * Prefixes a site path with the configured `base` from astro.config.mjs,
 * so every link keeps working whether the site lives at the domain root or in a sub-folder.
 *   url('/research') → '/research'  or  '/SaiVijwalNulakajodu.github.io/research'
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/')) return path; // external links, mailto: and so on
  return base + path;
}

/** The current path with the base removed, used to highlight the active nav link. */
export function stripBase(pathname: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return p.replace(/\/$/, '') || '/';
}
