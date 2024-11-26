import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard/consultas",
				permanent: true,
			},
			{
				source: "/dashboard",
				destination: "/dashboard/consultas",
				permanent: true,
			},
		];
	},
	/* config options here */
};

export default nextConfig;
