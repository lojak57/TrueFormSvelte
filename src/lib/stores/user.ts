import { writable } from 'svelte/store';
import type { UserSession } from '$lib/types';

export const userSession = writable<UserSession | null>(null);

export const isAuthenticated = writable<boolean>(false);

export const currentOrganization = writable<string | null>(null); 