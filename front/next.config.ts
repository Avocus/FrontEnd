import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* config options here */
  swcMinify: true,
  images: {
    domains: ['img.youtube.com'], // Adicione o domínio aqui
},
};

export default nextConfig;
