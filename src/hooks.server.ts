import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // TODO: Add proper auth guard back once session handling is fixed
  // For now, allow all routes to work
  
  return resolve(event);
};