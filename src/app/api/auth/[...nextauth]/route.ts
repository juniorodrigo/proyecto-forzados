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

				const pool = await poolPromise;
				const result = await pool.request().query(`SELECT u.*, A.AREA FROM MAE_USUARIO as u
         INNER JOIN MAE_AREA A on u.ID_AREA = A.ID_AREA
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
				return null;
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
