require = require('esm')(module);
const { routes } = require('./src/router/index.js');
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

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
    },
    configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, 'dist'),
        // Required - Routes to render.
        routes: [ '/', '/about', '/regions', '/uci', '/vacuna' ],
      })
    ]
  }
}

// const path = require('path')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')

// module.exports = {
//   configureWebpack: {
//   plugins: [
//     new PrerenderSPAPlugin({
//       // Required - The path to the webpack-outputted app to prerender.
//       staticDir: path.join(__dirname, 'dist'),
//       // Required - Routes to render.
//       routes: [ '/', '/about', '/regions', '/uci', '/vacuna' ],
//     })
//   ]
// }
// }
