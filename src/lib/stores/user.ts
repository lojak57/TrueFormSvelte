import type { UserSession } from "$lib/types";
import { writable } from "svelte/store";

export const userSession = writable<UserSession | null>(null);

export const isAuthenticated = writable<boolean>(false);

export const currentOrganization = writable<string | null>(null);
