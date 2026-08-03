// Преобразует YouTube URL в embed-ссылку для iframe

export const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Если это уже embed-ссылка
  if (url.includes('embed')) return url;
  
  // Если это ссылка на watch или короткая ссылка
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\?|&|$)/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  
  return url;
};