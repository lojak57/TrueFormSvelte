import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url }) => {
  const hostname = url.hostname;
  
  // Check if this is the CRM subdomain
  const isCRMSubdomain = hostname === 'crm.true-form-apps.com' || 
                        hostname.startsWith('crm.') ||
                        (hostname === 'localhost' && url.port === '5175') || // For local dev
                        url.searchParams.has('crm'); // Allow ?crm for local testing
  
  return {
    isCRMSubdomain
  };
};