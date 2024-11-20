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
				const result = await pool.request().query(`SELECT u.*, A.AREA FROM USUARIO as u
         INNER JOIN AREA A on u.ID_AREA = A.ID_AREA
         WHERE USERNAME = '${username}'`);

				if (result.recordset.length === 0) {
					throw new Error("Invalid username");
				}

				const registeredHash = result.recordset[0].CONTRASENAHASH;

				if (await bcrypt.compare(password ?? "", registeredHash)) {
					console.log("Password match");
					console.log(result.recordset[0]);
					return {
						id: result.recordset[0].ID,
						name: result.recordset[0].NOMBRE,
						email: result.recordset[0].CORREO,
						area: result.recordset[0].AREA,
					};
				} else {
					console.log("Password does not match");
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
