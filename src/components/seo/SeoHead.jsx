import { useEffect } from 'react';

function upsertMetaTag(attribute, key, content) {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonical(url) {
  if (!url) return;

  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', url);
}

function upsertJsonLd(schema) {
  const elementId = 'seo-jsonld';
  let element = document.getElementById(elementId);

  if (!schema) {
    if (element) {
      element.remove();
    }

    return;
  }

  if (!element) {
    element = document.createElement('script');
    element.setAttribute('type', 'application/ld+json');
    element.setAttribute('id', elementId);
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(schema);
}

export function SeoHead({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
  schema,
}) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    upsertMetaTag('name', 'description', description);
    upsertCanonical(canonical);

    upsertMetaTag('property', 'og:type', type);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', canonical);
    upsertMetaTag('property', 'og:image', image);

    upsertMetaTag('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertMetaTag('name', 'twitter:image', image);
    upsertMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    upsertJsonLd(schema);
  }, [canonical, description, image, noindex, schema, title, type]);

  return null;
}
