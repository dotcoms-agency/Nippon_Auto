import { useEffect } from 'react';

interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
}

const BASE_TITLE = 'Nippon Auto';

export function useSEO({ title, description, image }: SEOOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    document.title = fullTitle;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const setOG = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (description) {
      setMeta('description', description);
      setOG('og:description', description);
    }

    setOG('og:title', fullTitle);
    setOG('og:type', 'website');

    if (image) {
      setOG('og:image', image);
    }
  }, [title, description, image]);
}
