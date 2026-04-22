/**
 * YouTube URL utilities.
 *
 * Accepts the most common public YouTube URL shapes:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - https://www.youtube-nocookie.com/embed/VIDEO_ID
 *   - Plain 11-char video IDs
 */
const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

export function getYouTubeVideoId(input: string | null | undefined): string | null {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;

  if (YOUTUBE_ID_REGEX.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");
  const isYoutubeHost =
    host === "youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtube-nocookie.com" ||
    host === "youtu.be";
  if (!isYoutubeHost) return null;

  if (host === "youtu.be") {
    const id = url.pathname.replace(/^\//, "").split("/")[0];
    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  const v = url.searchParams.get("v");
  if (v && YOUTUBE_ID_REGEX.test(v)) return v;

  const pathSegments = url.pathname.split("/").filter(Boolean);
  const embedIdx = pathSegments.findIndex(
    (seg) => seg === "embed" || seg === "shorts" || seg === "v" || seg === "live",
  );
  if (embedIdx >= 0 && pathSegments[embedIdx + 1]) {
    const candidate = pathSegments[embedIdx + 1];
    return YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
  }

  return null;
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}
