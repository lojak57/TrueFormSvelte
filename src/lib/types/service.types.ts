import type { ComponentType } from "svelte";

export interface ServiceFeature {
  icon: ComponentType;
  title: string;
  description: string;
}

export interface ServiceMarketingSection {
  title: string;
  description: string;
  highlights: string[];
  benefits: string[];
}

export interface ServiceData {
  // Hero Section
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  badge?: string;
  
  // Features
  features: ServiceFeature[];
  
  // Marketing Content
  marketingContent: ServiceMarketingSection;
  
  // CTA
  ctaTitle: string;
  ctaDescription: string;
  
  // Meta
  slug: string;
  metaTitle: string;
  metaDescription: string;
}

// Missing types for components
export interface ServiceGalleryItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  company?: string;
  rating?: number;
}