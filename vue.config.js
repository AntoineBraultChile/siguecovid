require = require('esm')(module);
const { routes } = require('./src/router/index.js');

// const routes = router.routes

module.exports = {
    pluginOptions: {
        sitemap: {
            baseURL: 'https://siguecovid.cl',
            routes,
            pretty:true,
            defaults: {
              lastmod:    '2021-04-30',
              changefreq: 'daily',
              priority:   1.0,
            },
        }
    }
}
