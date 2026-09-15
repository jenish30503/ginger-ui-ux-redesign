function parseUrl(value: string): URL | null {
  try { const url = new URL(value.trim()); return url.protocol === 'https:' && !url.username && !url.password && !url.port ? url : null } catch { return null }
}
export function extractYouTubeId(value: string): string | null {
  const url = parseUrl(value)
  if (!url) return null
  let id: string | null = null
  if (url.hostname === 'youtu.be') id = /^\/([\w-]{11})\/?$/.exec(url.pathname)?.[1] ?? null
  if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
    id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:shorts|embed)\/([\w-]{11})\/?$/.exec(url.pathname)?.[1] ?? null
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null
}
export function extractInstagramCode(value: string): string | null {
  const url = parseUrl(value)
  if (!url || !['instagram.com', 'www.instagram.com'].includes(url.hostname)) return null
  return /^\/reels?\/([\w-]{5,32})\/?$/.exec(url.pathname)?.[1] ?? null
}
export function inspectVideo(value: string) {
  const youtube = extractYouTubeId(value)
  if (youtube) return { platform: 'YouTube', id: youtube, url: `https://www.youtube.com/watch?v=${youtube}` }
  const instagram = extractInstagramCode(value)
  if (instagram) return { platform: 'Instagram', id: instagram, url: `https://www.instagram.com/reel/${instagram}/` }
  return null
}
