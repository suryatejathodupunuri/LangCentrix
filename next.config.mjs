/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // 307 Temporary Redirect
      },
    ];
  },
};

export default nextConfig;
