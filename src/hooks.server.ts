import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const url = event.url;
  const hostname = url.hostname;
  
  console.log(`[HOOKS] ${hostname}${url.pathname}`);
  
  // Check if this is the CRM subdomain
  const isCRMSubdomain = hostname === 'crm.true-form-apps.com' || 
                         hostname.startsWith('crm.') ||
                         (hostname === 'localhost' && url.port === '5175') || // For local dev
                         url.searchParams.has('crm'); // Allow ?crm for local testing
  
  // If CRM subdomain, handle admin routing
  if (isCRMSubdomain) {
    console.log(`[CRM] Processing: ${url.pathname}`);
    
    // Redirect root of CRM to admin dashboard
    if (url.pathname === '/') {
      console.log(`[CRM] Redirecting root to /admin/dashboard`);
      throw redirect(302, '/admin/dashboard');
    }
    
    // Allow these paths without modification
    if (url.pathname.startsWith('/admin') || 
        url.pathname.startsWith('/auth') || 
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/_app')) {
      console.log(`[CRM] Allowing path: ${url.pathname}`);
      // Let it through
    } else {
      console.log(`[CRM] Redirecting ${url.pathname} to /admin${url.pathname}`);
      throw redirect(302, `/admin${url.pathname}`);
    }
  } 
  // If main domain, block admin routes
  else {
    if (url.pathname.startsWith('/admin')) {
      console.log(`[MAIN] Redirecting admin route to CRM`);
      throw redirect(302, 'https://crm.true-form-apps.com' + url.pathname);
    }
  }

  const response = await resolve(event);
  return response;
};