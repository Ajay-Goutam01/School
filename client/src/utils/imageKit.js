/**
 * Appends ImageKit transformation parameters (width, height, quality) if the image is hosted on ImageKit.
 * Falls back to original URL if it is a local data URI or external unsplash URL.
 */
export const getOptimizedImageUrl = (url, width, height, quality = 80) => {
  if (!url) return '';
  if (url.includes('ik.imagekit.io')) {
    const joinChar = url.includes('?') ? '&' : '?';
    let transformations = [];
    if (width) transformations.push(`w-${width}`);
    if (height) transformations.push(`h-${height}`);
    if (quality) transformations.push(`q-${quality}`);
    transformations.push('fo-auto');

    return `${url}${joinChar}tr=${transformations.join(',')}`;
  }
  return url;
};
