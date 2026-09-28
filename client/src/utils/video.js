// Converts common YouTube URL formats into an embeddable URL.
// Returns null if the URL isn't a recognizable YouTube link, so the caller
// can fall back to a plain "watch externally" link for other video hosts.
export function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}
