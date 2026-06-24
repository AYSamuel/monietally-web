const createNextIntlPlugin = require("next-intl/plugin");

// Points the plugin at the request-config module (i18n/request.ts).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withNextIntl(nextConfig);
