/** @type {import('next').NextConfig} */
const nextConfig = {
	// Silence warnings
	// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
	images: {
		domains: ["www.gravatar.com", "ampdlabs.mypinata.cloud", "gravatar.com"],
	},
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");
		return config;
	},
};

export default nextConfig;
