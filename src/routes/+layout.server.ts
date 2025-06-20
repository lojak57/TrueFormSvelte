import { verifySession } from "$lib/utils/auth";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, cookies, depends }) => {
  // This dependency will be invalidated when auth state changes
  depends('supabase:auth');
  
  const hostname = url.hostname;
  
  // Check if this is the CRM subdomain
  const isCRMSubdomain = hostname === 'crm.true-form-apps.com' || 
                        hostname.startsWith('crm.') ||
                        (hostname === 'localhost' && url.port === '5175') || // For local dev
                        url.searchParams.has('crm'); // Allow ?crm for local testing
  
  // Get session for auth state
  const session = await verifySession(cookies);
  
  return {
    isCRMSubdomain,
    session
  };
};