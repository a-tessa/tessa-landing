export type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
export type InstagramSelectionSlot = "primary" | "upperRight" | "lowerRight";

export interface InstagramPublicationDto {
  id: string;
  instagramMediaId: string;
  mediaType: InstagramMediaType;
  caption: string | null;
  altText: string | null;
  permalink: string;
  imageUrl: string;
  slot: InstagramSelectionSlot;
  isCollaborative: boolean;
  publishedAt: string;
  syncedAt: string;
}

export interface InstagramPublicationsListResponseDto {
  media: InstagramPublicationDto[];
}

export interface FetchInstagramPostsParams {
  limit?: number;
  locale?: string;
}
