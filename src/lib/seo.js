export const SITE_URL = 'https://carlizdoces.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/logo/logo-carlizdoces.png`;

export function absoluteUrl(pathname = '/') {
  if (!pathname.startsWith('/')) return `${SITE_URL}/${pathname}`;
  return `${SITE_URL}${pathname}`;
}
