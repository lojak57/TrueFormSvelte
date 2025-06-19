import type { ComponentType } from "svelte";

export interface ServiceFeature {
  icon: ComponentType;
  title: string;
  description: string;
}

export interface ServiceGalleryItem {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface ServiceTestimonial {
  quote: string;
  author: string;
  company: string;
  role: string;
  avatar?: string;
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
  
  // Gallery
  gallery: ServiceGalleryItem[];
  
  // Testimonial
  testimonial: ServiceTestimonial;
  
  // CTA
  ctaTitle: string;
  ctaDescription: string;
  
  // Meta
  slug: string;
  metaTitle: string;
  metaDescription: string;
}