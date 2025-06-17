import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logoutUser } from '$lib/services/authService';

export const POST: RequestHandler = async () => {
  try {
    const { error } = await logoutUser();
    
    if (error) {
      return json({ error }, { status: 500 });
    }
    
    // Successful logout
    return json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    return json({ error: 'Failed to sign out' }, { status: 500 });
  }
};

// Also handle GET requests for direct navigation
export const GET: RequestHandler = async () => {
  try {
    await logoutUser();
    throw redirect(302, '/');
  } catch (error) {
    if (error instanceof Response) {
      return error; // This is the redirect
    }
    console.error('Signout error:', error);
    throw redirect(302, '/');
  }
}; 