import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			runtime: 'nodejs18.x',
			regions: ['iad1'], // US East for better performance
			memory: 1024,
			maxDuration: 30
		})
	},
	preprocess: vitePreprocess()
};

export default config; 