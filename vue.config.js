require = require("esm")(module);
const { routes } = require("./src/router/index.js");
const path = require("path");
const PrerenderSPAPlugin = require("prerender-spa-plugin");

const webpack = require("webpack");

module.exports = {
  pluginOptions: {
    sitemap: {
      baseURL: "https://siguecovid.cl",
      routes,
      pretty: true,
      defaults: {
        lastmod: "2021-05-03",
        changefreq: "daily",
        priority: 1.0,
      },
    },
  },
  configureWebpack: {
    externals: {
      moment: "moment",
    },
    plugins: [
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, "dist"),
        // Required - Routes to render.
        routes: ["/", "/about", "/regions", "/comunas", "/edad", "/vacuna", "/impacto", "/variantes"],
      }),
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
};
