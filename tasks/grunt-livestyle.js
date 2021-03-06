var Path = require('path');
var open = require('open');

module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('livestyle', 'Description', function () {
        this.async();

        var config = grunt.config(this.name) || {},
            options = {
                root: Path.resolve(config.root || 'app'),
                port: config.port || 9000,
                proxy: config.proxy || null,
                jsx: config.jsx === false ? false : true,
                less: config.less === false ? false : true,
                scss: config.scss === false ? false : true,
                html: config.watchHtml === false ? false : true,
                cssImages: config.watchCssImages === false ? false : true,
                processimage: config.processimage === false ? false : true,
                debug: !!config.debug,
                dead: !!config.dead,
                mappings: config.mappings || {}
            };

        if (config.browsers === false) {
            options.browsers = false;
        } else if (typeof config.browsers === 'string') {
            options.browsers = [config.browsers];
        } else if (Array.isArray(config.browsers)) {
            options.browsers = config.browsers;
        } else {
            // Autoprefixer default
            options.browsers = [
                '> 1%',
                'last 2 versions',
                'Firefox ESR',
                'Opera 12.1'
            ];
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
        }).listen(options.port, '0.0.0.0', function (error) {
            if (error) {
                return grunt.log.writeln(error);
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
            grunt.event.emit('serverListening', options.port);

            open('http://0.0.0.0:' + options.port + '/');
        });

        if (!options.dead) {
            require('livestyle/lib/installLiveCssFileWatcherInServer')(server, {
                debug: options.debug,
                root: options.root,
                mtime: false,
                watchfile: false,
                mappings: options.mappings,
                watchCssImages: options.cssImages
            }, require('socket.io'));
        }

    });
};
