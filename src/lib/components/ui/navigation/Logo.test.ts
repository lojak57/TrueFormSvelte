import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Logo from './Logo.svelte';

describe('Logo Component', () => {
  it('renders the logo image with correct attributes', () => {
    render(Logo);
    
    const logoImage = screen.getByAltText('TrueForm Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/logo.svg');
    expect(logoImage).toHaveClass('w-full', 'h-full', 'object-contain');
  });

  it('renders the company name and tagline', () => {
    render(Logo);
    
    expect(screen.getByText('TrueForm')).toBeInTheDocument();
    expect(screen.getByText('Excellence Refined.')).toBeInTheDocument();
  });

  it('has a clickable link to home page', () => {
    render(Logo);
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveAttribute('href', '/');
    expect(logoLink).toBeInTheDocument();
  });

  it('applies correct responsive classes', () => {
    render(Logo);
    
    const logoContainer = screen.getByAltText('TrueForm Logo').parentElement;
    expect(logoContainer).toHaveClass('w-12', 'h-12', 'md:w-16', 'md:h-16');
    
    const textContainer = screen.getByText('TrueForm').parentElement;
    expect(textContainer).toHaveClass('ml-3', 'hidden', 'sm:block');
  });

  it('applies hover effect classes', () => {
    render(Logo);
    
    const logoLink = screen.getByRole('link');
    expect(logoLink).toHaveClass('group', 'transition-transform', 'duration-300', 'hover:scale-105');
    
    const logoImage = screen.getByAltText('TrueForm Logo');
    expect(logoImage).toHaveClass('group-hover:drop-shadow-lg', 'transition-all', 'duration-300');
    
    const companyName = screen.getByText('TrueForm');
    expect(companyName).toHaveClass('group-hover:text-accent-600', 'transition-colors', 'duration-300');
  });

  it('has proper typography classes', () => {
    render(Logo);
    
    const companyName = screen.getByText('TrueForm');
    expect(companyName).toHaveClass('text-xl', 'md:text-2xl', 'font-bold', 'text-gray-900');
    
    const tagline = screen.getByText('Excellence Refined.');
    expect(tagline).toHaveClass('text-xs', 'md:text-sm', 'text-gray-600', 'font-medium', 'italic');
  });

  it('has accessible structure', () => {
    render(Logo);
    
    // Should have one main link
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    
    // Image should have meaningful alt text
    const logoImage = screen.getByRole('img');
    expect(logoImage).toHaveAccessibleName('TrueForm Logo');
  });

  it('maintains proper semantic structure', () => {
    const { container } = render(Logo);
    
    // Should be wrapped in a flex container
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('flex', 'items-center');
    
    // Link should contain both image and text elements
    const logoLink = screen.getByRole('link');
    expect(logoLink.children).toHaveLength(2); // Image container + text container
  });
}); 