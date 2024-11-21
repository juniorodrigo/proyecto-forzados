import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard/consultas", // Cambia por la ruta deseada
				permanent: true, // `true` para redirección 301, `false` para 302
			},
		];
	},
	/* config options here */
};

export default nextConfig;
