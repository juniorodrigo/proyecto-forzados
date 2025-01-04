// types/next-auth.d.ts

declare module "next-auth" {
	interface Session {
		user: {
			id: number;
			name: string;
			email: string;
			area: string;
		};
	}
}
