import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { poolPromise } from "@sql/lib/db";
import bcrypt from "bcrypt";

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

				const pool = await poolPromise;
				const result = await pool.request().query(`SELECT * FROM USUARIO WHERE USERNAME = '${username}'`);

				const saltRounds = 10;
				const hashedPassword = await bcrypt.hash(password ?? "", saltRounds);

				const registeredHash = result.recordset[0].CONTRASENAHASH;

				if (await bcrypt.compare(hashedPassword ?? "", registeredHash)) {
					console.log("Password match");
					// return {
					// 	id: result.recordset[0].ID,
					// 	name: result.recordset[0].NOMBRE,
					// 	email: result.recordset[0].CORREO,
					// };
				}

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
