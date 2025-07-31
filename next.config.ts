import type { NextConfig } from 'next'

const nextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'resources.premierleague.com',
				port: '',
				pathname: '/premierleague/badges/**',
			},
		],
		unoptimized: true,
	},
}

export default nextConfig
