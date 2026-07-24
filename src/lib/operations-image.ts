/**
 * Loading policy for the Operations gallery (issue 06).
 *
 * All images stay in the SSR HTML. The first six start eagerly; only the
 * single most relevant thumb gets high-priority preload. The rest lazy-load
 * as they approach the horizontal viewport.
 */

export const EAGER_OPERATION_IMAGE_COUNT = 6;

export const OPERATION_IMAGE_SIZES = {
  mobileThumb: "90vw",
  desktopThumb: "(max-width: 1024px) 30vw, 260px",
  mobileExpand: "100vw",
  desktopExpand: "(max-width: 1024px) 60vw, 720px",
} as const;

export type OperationImageLoading = "eager" | "lazy";

export function isEagerOperationImageIndex(index: number): boolean {
  return index >= 0 && index < EAGER_OPERATION_IMAGE_COUNT;
}

export function isPriorityOperationImageIndex(index: number): boolean {
  return index === 0;
}

export function getOperationImageLoading(index: number): OperationImageLoading {
  return isEagerOperationImageIndex(index) ? "eager" : "lazy";
}

/**
 * Flat gallery index for desktop bento cells.
 * Each slide holds up to 4 images in column pairs: [0,1] | [2,3].
 */
export function getDesktopOperationFlatIndex(
  slideIndex: number,
  colIndex: number,
  imgIndex: number,
): number {
  return slideIndex * 4 + colIndex * 2 + imgIndex;
}
