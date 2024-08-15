// See https://kit.svelte.dev/docs/types#app

import type { SessionUser } from "./hooks.server";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?:SessionUser
		}
		interface PageData {
			user:SessionUser
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
