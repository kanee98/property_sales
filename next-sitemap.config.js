export default {
  siteUrl: 'https://propwise.lk',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/register'],
      },
    ],
  },
  exclude: ['/admin', '/login', '/register'],
};
