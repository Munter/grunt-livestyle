module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('livestyle', 'Description', function () {
        this.async();

        var config = grunt.config(this.name) || {},
            options = {
                root: config.root || 'app',
                port: config.port || 9000,
                proxy: config.proxy || null,
                jsx: config.jsx || true,
                less: config.less || true,
                scss: config.scss || true,
                html: config.watchHtml || true,
                cssImages: config.watchCssImages || true,
                processimage: config.processimage || true,
                debug: !!config.debug,
                mappings: {},
                browsers: config.browsers || [
                    '> 1%',
                    'last 2 versions',
                    'Firefox ESR',
                    'Opera 12.1'
                ]
            };

        if (config.mappings) {
            config.mappings.forEach(function (urlEqualsDir) {
                var matchUrlEqualsDir = urlEqualsDir.match(/^([^=]+)=([^=]+)$/);
                if (matchUrlEqualsDir) {
                    options.mappings[matchUrlEqualsDir[1]] = matchUrlEqualsDir[2];
                } else {
                    throw 'Invalid --map syntax: ' + urlEqualsDir;
                }
            });
        }

        var server = require('livestyle/lib/createLiveStyleApp')({
            watchHtml: options.html,
            watchCssImages: options.cssImages,
            dead: options.dead,
            debug: options.debug,
            root: options.root,
            compiless: options.less,
            compilesass: options.scss,
            autoprefixer: options.browsers,
            jsxtransform: options.jsx,
            processImage: options.processimage,
            mappings: options.mappings,
            proxy: options.proxy
        }).listen(options.port, '0.0.0.0');

        if (!options.dead) {
            require('livestyle/lib/installLiveCssFileWatcherInServer')(server, {
                debug: options.debug,
                root: options.root,
                mtime: false,
                watchfile: true,
                mappings: options.mappings,
                watchCssImages: options.cssImages
            }, require('socket.io'));
        }

        if (options.proxy) {
            grunt.log.writeln('Proxying to ' + options.proxy);
            if (options.root) {
                grunt.log.writeln('Serving static CSS files from ' + options.root);
            }
        } else if (options.root) {
            grunt.log.writeln('Serving static files from ' + options.root);
        }

        grunt.log.writeln('Listening to http://' + '0.0.0.0' + ':' + options.port + '/');
    });
};
