import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const { username, password } = credentials ?? {};

				// Hardcoded credentials
				const validUsername = "ADMINADMIN";
				const validPassword = "ADMINADMIN1";

				console.log("credentials", credentials);

				if (typeof username === "string" && username.toUpperCase() === validUsername && password === validPassword) {
					return {
						id: "1",
						name: "Admin User",
						email: "admin@example.com",
					};
				}

				throw new Error("Invalid credentials");
			},
		}),
	],
	pages: {
		signIn: "/auth/ingresar",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET || "lvjancarrion",
});

export { handler as GET, handler as POST };
