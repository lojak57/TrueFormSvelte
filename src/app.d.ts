// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('@supabase/supabase-js').User | null;
		}
		
		interface PageData {
			user?: import('@supabase/supabase-js').User | null;
		}
		
		// interface Error {}
		// interface Platform {}
	}
}

export {};

declare module '$env/static/private' {
	export const SUPABASE_SERVICE_ROLE_KEY: string;
	export const STRIPE_SECRET_KEY: string;
}

declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
	export const PUBLIC_APP_URL: string;
	export const PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
} 