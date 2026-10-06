import { useEffect, useState } from 'react';

export function useHtmlImage(url: string): {
  image: HTMLImageElement | null;
  status: 'loading' | 'loaded' | 'failed';
} {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    if (!url) {
      setImage(null);
      setStatus('failed');
      return;
    }

    setStatus('loading');
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };
    img.onerror = () => {
      setImage(null);
      setStatus('failed');
    };

    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return { image, status };
}