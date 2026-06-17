/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Alerta: Isso ignora os erros de tipagem APENAS na hora de buildar no Render
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
