const {InjectManifest} = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: function(config, env) {
    config.plugins.push(
      new InjectManifest({
        globPatterns: [
          'images/*.png',
          'images/*.jpg',
          'icons/*.svg',
          'videos/*.mp4',
          'fonts/*.ttf',
          'css/*.css',
          'index.php',
        ],
        globDirectory: 'public',

      })
    );

    return config;
  }
}