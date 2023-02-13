/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    exportPathMap: async function (defaultPathMap) {
        return {
          '/': { page: '/' },
          '/login': { page: '/[slug]' },
          '/register': { page: '/[slug]' },
          '/resetPassword': { page: '/[slug]' },
          '/item': { page: '/[slug]' },
          '/booking': { page: '/booking' },
          '/create': { page: '/create' },
          '/edit': { page: '/edit' },
          '/rentalOwner': { page: '/rentalOwner' },
          '/profile': { page: '/profile' },
          '/setting': { page: '/setting' },
          '/setting/profile': { page: '/setting/[slug]' },
          '/setting/payment': { page: '/setting/[slug]' },
          '/setting/location': { page: '/setting/[slug]' },
          '/rentalOwner': { page: '/rentalOwner' },
        }
      }
}

module.exports = nextConfig