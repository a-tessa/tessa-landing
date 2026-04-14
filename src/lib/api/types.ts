export interface HeroTopic {
  title: string;
  description: string;
  image: string;
  button: {
    text: string;
    url: string;
  };
}

export interface SceneryItem {
  slug: string;
  title: string;
  category: string;
  image: string;
}

export interface PublicContentResponse {
  content: {
    heroSection?: HeroTopic[];
    scenerySection?: SceneryItem[];
    [key: string]: unknown;
  };
  publishedAt: string | null;
  updatedAt: string | null;
}
