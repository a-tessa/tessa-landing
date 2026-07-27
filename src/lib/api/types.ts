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

export interface IndustryVideo {
  url: string;
  startSeconds?: number;
}

export interface IndustrySection {
  titlePrefix: string;
  title: string;
  subtitle: string;
  videos: {
    "pt-BR": IndustryVideo;
    en?: IndustryVideo;
    es?: IndustryVideo;
  };
}

export interface AboutPillar {
  title: string;
  description: string;
}

export interface AboutSection {
  heroTitle: string;
  videos: {
    "pt-BR": IndustryVideo;
    en?: IndustryVideo;
    es?: IndustryVideo;
  };
  sideImage: {
    url: string;
    alt: string;
  };
  body: string;
  mission: AboutPillar;
  vision: AboutPillar;
  values: AboutPillar;
}

export interface OperationImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface OperationSection {
  images: OperationImage[];
}

export interface ServicesPageImage {
  imgUrl: string;
}

export interface ServicesPageItem {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  exampleVideoUrl: string;
  backgroundImageUrl: string;
  images: ServicesPageImage[];
}

export interface ClientLogo {
  id?: string;
  name: string;
  alt: string;
  website?: string;
  logoUrl: string;
}

export interface PublicRepresentative {
  name: string;
  companyName?: string;
  segment: string;
  phone: string;
  city: string;
  state: string;
  email: string;
}

export interface BlogCategory {
  name: string;
  slug: string;
}

export interface HeadingImageEntry {
  url: string;
}

export type HeadingImagePageKey =
  | "quem-somos"
  | "servicos"
  | "representantes"
  | "blog"
  | "downloads"
  | "galeria"
  | "contato";

export type HeadingImages = Partial<
  Record<HeadingImagePageKey, HeadingImageEntry>
>;

export interface PublicContentResponse {
  content: {
    heroSection?: HeroTopic[];
    industrySection?: IndustrySection;
    aboutSection?: AboutSection;
    operationSection?: OperationSection;
    scenerySection?: SceneryItem[];
    servicesPages?: ServicesPageItem[];
    clients?: ClientLogo[];
    representantsBase?: PublicRepresentative[];
    categories?: BlogCategory[];
    headingImages?: HeadingImages;
    [key: string]: unknown;
  };
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface PublicClientsResponse {
  clients: ClientLogo[];
}

export type TestimonialSource = "submitted" | "google";

export interface PublicTestimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  companyName: string | null;
  rating: number;
  comment: string;
  question: string | null;
  profileImageUrl: string | null;
  reviewImageUrl: string | null;
  source: TestimonialSource;
  authorUrl: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface TestimonialAggregate {
  average: number;
  count: number;
}

export interface PublicTestimonialsResponse {
  testimonials: PublicTestimonial[];
  aggregate: TestimonialAggregate;
}
