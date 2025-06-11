import { useEffect, useState } from "react";

const MAX_CACHE_ENTRIES = 20;

type CachedImageEntry = {
  value: string;
  hits: number;
};

const croppedImageCache = new Map<string, CachedImageEntry>();

const getCache = (url: string) => {
  const entry = croppedImageCache.get(url);
  if (entry) {
    entry.hits += 1;
    console.log(entry);
    return entry.value;
  }
};

const setCache = (url: string, value: string) => {
  if (croppedImageCache.size >= MAX_CACHE_ENTRIES) {
    let keyToEvict: string | null = null;
    let lowestHits = Infinity;

    for (const [key, entry] of croppedImageCache.entries()) {
      if (entry.hits < lowestHits) {
        lowestHits = entry.hits;
        keyToEvict = key;
      }
    }

    if (keyToEvict) {
      croppedImageCache.delete(keyToEvict);
    }
  }

  croppedImageCache.set(url, { value, hits: 1 });
};

export function useCroppedImage(imageUrl?: string): string | undefined {
  const [croppedSrc, setCroppedSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!imageUrl) {
      setCroppedSrc(undefined);
      return;
    }

    if (croppedImageCache.has(imageUrl)) {
      setCroppedSrc(getCache(imageUrl));
      return;
    }

    let isCancelled = false;

    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      });

    const cropImage = (img: HTMLImageElement): string | null => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const { naturalWidth: width, naturalHeight: height } = img;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      let top: number | null = null;
      let left: number | null = null;
      let right: number | null = null;
      let bottom: number | null = null;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = pixels[(y * width + x) * 4 + 3];
          if (alpha !== 0) {
            if (top === null) top = y;
            if (left === null || x < left) left = x;
            if (right === null || x > right) right = x;
            bottom = y;
          }
        }
      }

      if (top === null || left === null || right === null || bottom === null) {
        console.warn("Image is fully transparent.");
        return null;
      }

      const trimmedWidth = right - left + 1;
      const trimmedHeight = bottom - top + 1;
      const trimmed = ctx.getImageData(left, top, trimmedWidth, trimmedHeight);

      canvas.width = trimmedWidth;
      canvas.height = trimmedHeight;

      const newCtx = canvas.getContext("2d");
      if (!newCtx) return null;

      newCtx.putImageData(trimmed, 0, 0);

      return canvas.toDataURL();
    };

    setCroppedSrc(undefined);

    loadImage(imageUrl)
      .then((img) => {
        if (isCancelled) return;
        const cropped = cropImage(img) ?? imageUrl;
        setCache(imageUrl, cropped);
        setCroppedSrc(cropped);
      })
      .catch((err) => {
        console.error("Image cropping failed:", err);
        if (!isCancelled) {
          setCroppedSrc(imageUrl);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [imageUrl]);

  return croppedSrc;
}
