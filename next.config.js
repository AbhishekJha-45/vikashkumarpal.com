const withFonts = require("next-fonts");
const webpack = require("webpack");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,

  trailingSlash: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "admin.improvefx.com",
      "assets-global.website-files.com",
      "ncmaz-nextjs.vercel.app",
      "admin.vikashkumarpal.com",
      "secure.gravatar.com",
      "vikashkumarpal.com",
    ],
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      })
    );

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap?slug=/",
      },
      {
        source: "/services/sitemap.xml",
        destination: "/api/services/sitemap?slug=services",
      },
      {
        source: "/post/sitemap.xml",
        destination: "/api/post/sitemap?slug=post",
      },
      {
        source: "/consulting/sitemap.xml",
        destination: "/api/consulting/sitemap?slug=consulting",
      },
      {
        source: "/industries/sitemap.xml",
        destination: "/api/industries/sitemap?slug=industries",
      },
      {
        source: "/category/sitemap.xml",
        destination: "/api/category/sitemap?slug=category",
      },
      {
        source: "/authors/sitemap.xml",
        destination: "/api/authors/sitemap?slug=authors",
      },
      {
        source: "/case-study/sitemap.xml",
        destination: "/api/case-study/sitemap?slug=case-study",
      },
      {
        source: "/misc/sitemap.xml",
        destination: "/api/misc/sitemap?slug=misc",
      },
      {
        source: "/page/sitemap.xml",
        destination: "/api/page/sitemap?slug=page",
      },
    ];
  },
};

module.exports = withFonts({ ...nextConfig, assetPrefix: 'https://cdn.vikashkumarpal.com' });
