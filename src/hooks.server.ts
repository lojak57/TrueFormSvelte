import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const url = event.url;
  const hostname = url.hostname;
  
  // Check if this is the CRM subdomain
  const isCRMSubdomain = hostname === 'crm.true-form-apps.com' || 
                         (hostname === 'localhost' && url.port === '5175') || // For local dev
                         url.searchParams.has('crm'); // Allow ?crm for local testing
  
  // If CRM subdomain, handle admin routing
  if (isCRMSubdomain) {
    // Redirect root of CRM to admin dashboard
    if (url.pathname === '/') {
      throw redirect(302, '/admin/dashboard');
    }
    
    // Ensure all CRM routes start with /admin
    if (!url.pathname.startsWith('/admin') && 
        !url.pathname.startsWith('/auth') && 
        !url.pathname.startsWith('/api')) {
      throw redirect(302, `/admin${url.pathname}`);
    }
  } 
  // If main domain, block admin routes
  else {
    if (url.pathname.startsWith('/admin')) {
      throw redirect(302, 'https://crm.true-form-apps.com' + url.pathname);
    }
  }

  const response = await resolve(event);
  return response;
};