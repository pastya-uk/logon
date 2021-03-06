"use strict";

const path = require("path");
const fs = require("fs");
const pkg = require("./package");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const SmartBannerPlugin = require("smart-banner-webpack-plugin");
const UnminifiedWebpackPlugin = require("unminified-webpack-plugin");

module.exports = function(grunt) {

  const pkg_info = grunt.file.readJSON("package.json");

  grunt.initConfig({
    pkg: pkg_info,
    clean: {
      build: ["build/"],
      dev: ["build/"],
      dist: ["lib/"]
    },
    babel: {
      dist: {
        files: [
          {
            expand: true,
            cwd:    "src",
            src:    ["**/*.js", "**/*.jsx"],
            dest:   "lib",
            ext:    '.js'
          }
        ]
      }
    },
    env: {
      build: {
        NODE_ENV: "production"
      }
    },
    exec: {
      touch_index: "touch src/index.js"
    },
    webpack: {
      options: webpackConfig,
      build: {
        devtool: "source-map",
        output: {
          path: path.join(__dirname, "build"),
          filename: 'logon.min.js'
        },
        watch: false,
        keepalive: false,
        inline: false,
        hot: false,
        devtool: 'source-map',
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('production')
            }
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false, screw_ie8: true },
            comments: false
          }),
          new UnminifiedWebpackPlugin(),
          new SmartBannerPlugin(
            `[filename] v${pkg_info.version}\n\nAuthor: ${pkg_info.author}\nDate: ${new Date().toLocaleString()}\nLicense: ${pkg_info.license}\n`,
            { raw: false, entryOnly: true }
          )
        ]
      }
    },
    "webpack-dev-server": {
      options: {
        webpack: webpackConfig,
        publicPath: "/build/"
      },
      dev: {
        keepAlive: true,
        port: 3000,
        webpack: {
          devtool: "eval",
          debug: true
        }
      },
      design: {
        keepAlive: true,
        webpack: {
          entry: './support/design/index.js',
          output: {
            path: path.join(__dirname, "build"),
            filename: 'logon.design.js'
          },
          devtool: "eval",
          debug: true
        }
      }
    },
    "i18n": {
      dist: {
        files: [
          {
            expand: true,
            cwd:    "lib/i18n",
            src:    "**/*.js",
            dest:   "build",
            ext:    '.js'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-babel");
  grunt.loadNpmTasks("grunt-webpack");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("build", ["clean:build", "env:build", "webpack:build"]);
  grunt.registerTask("dist", ["clean:dist", "babel:dist", "i18n:dist"]);
  grunt.registerTask("prepare_dev", ["clean:dev"]);
  grunt.registerTask("dev", ["prepare_dev", "webpack-dev-server:dev"]);
  grunt.registerTask("design", ["prepare_dev", "webpack-dev-server:design"]);
  grunt.registerMultiTask("i18n", "Prepares i18n files to be hosted in CDN", function () {
    grunt.task.requires("babel:dist");
    var languages = {};
    var Auth0 = {
      registerLanguageDictionary: function(lang, dict) {
        languages[lang] = dict;
      }
    };
    this.files.forEach(function (file) {
      var filename = file.src[0];
      var lang = path.basename(filename, '.js');
      var dict = require('./' + filename).default || require('./' + filename);
      var jsonp = `Auth0.registerLanguageDictionary("${lang}", ${JSON.stringify(dict)});`;
      eval(jsonp.toString());
      if (languages[lang] === undefined) {
        grunt.fail.fatal(`Failed to process language file ${filename}`);
      }
      grunt.file.write(file.dest, jsonp);
      grunt.log.ok(`Built ${lang}.js file`);
    });
  });
};
