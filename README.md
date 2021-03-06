Grunt-livestyle
===============
[![NPM version](https://badge.fury.io/js/grunt-livestyle.svg)](http://badge.fury.io/js/grunt-livestyle)
[![Build Status](https://travis-ci.org/Munter/grunt-livestyle.svg?branch=master)](https://travis-ci.org/Munter/grunt-livestyle)
[![Dependency Status](https://david-dm.org/Munter/grunt-livestyle.svg)](https://david-dm.org/Munter/grunt-livestyle)

Grunt-livestyle is a static development server that allows you to have a very efficient development loop with a minimal configuration. The aim of this project is to deliver an out of the box working server that does the right thing, lets the developer work without massive processing toolchains, and simplify their code base down to just working with urls that work in a browser.

By default it preprocesses things like Less, Scss an React Jsx in the HTTP stream itself, leaving no build artifacts on disk. This allows you work with your raw files as if they were the end target the browser will consume, like `<link rel="stylesheet" href="main.scss">` or `require('css!main.scss')`, which will both include the `.scss` file from the correct disk location, but what will be sent over the wire is the compiled CSS.

By default it sets up file watchers on all files it knows how to live reload and sets up live reloading. This means you no longer have to configure which files to watch and livereload. It's figured out based on what files you request when you load a page in development, cutting down on your configuration complexity.

By default it autoprefixes all outgoing CSS. Since you probably have autoprefixer in your production build step, you also want it in your development cycle to make sure you are actually working on the same output.

By default it can post process images in the HTTP stream for you. Have you ever been annoyed at having to manually create responsive image sizes by hand, resizing favicons to 16 different sizes or having to manually tweak image color palettes or compression ratios? In that case this is a massive power tool for you. Livestyle leverages the power of GraphicsMagick, pngquant, pngcrush, optipng, jpegtran etc. You can resize, recompress and manipulate images in lots of ways, simply by adding some HTTP parameters at the end of each image URL. This all happens in the HTTP stream with the original image untouched, leaving you with a clean interface to your graphics department. Take a look at the many options available via [express-processimage](https://github.com/papandreou/express-processimage#query-string-syntax)

Grunt-livestyle has a really good team mate [grunt-reduce](https://github.com/Munter/grunt-reduce), which adds the same functionalities, only for a web performance optimized production build output. Use these two in combination for an optimal lean and fast development loop with a highly optimal bundled and compressed end result.


Installation
------------

To install the basic functionality:

```
npm install --save-dev grunt-livestyle
```

Grunt-livestyle enables you to preprocess Less, Scss, Jsx and images in the HTTP stream. However it doesn't want to lock you down to a specific version of a preprocessor, as functionality might vary across versions, you might be stuck on an old version, you want to use a beta or whatever. This means installing the preprocessor is up to you. You will get a warning in the logs if you try to send something through the pipeline that is missing the corresponding module to compile, however it might be nice just to install what you need up front:

- **Less:** `npm install --save-dev less`
- **Scss:** `npm install --save-dev node-sass`
- **Jsx:** `npm install --save-dev react-tools`

Dependencies for image processing are slightly more elaborate as the image manipulation libraries are operating system specific:

- **Linux (Debian):** `sudo apt-get install -y libjpeg8-dev libgif-dev optipng pngcrush pngquant libpango1.0-dev graphicsmagick libjpeg-turbo-progs inkscape`
- **MacOX (Homebrew):** `brew install jpeg giflib optipng pngcrush pngquant pango graphicsmagick jpeg-turbo inkscape`
- **Windows:** Unknown. If you have any windows experience we're taking pull requests for docs


Minimal Configuration Example
-----------------------------

Grunt-livestyle has as many sane defaults as possible. If your project is just a static web page, the simplest setting should be enough for you.

```JavaScript
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-livestyle');

    grunt.initConfig({
        'livestyle': {
            root: 'app'
        }
    });
};
```

Full Configuration Example
--------------------------

This shows you all possible configuration parametres, a bit of explanation on each and their default setting.

```JavaScript
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-livestyle');

    grunt.initConfig({
        'livestyle': {
            // The root of your web application
            root: 'app',

            // The port that the web server will listen on
            port: 9000,

            // The fallback web server to proxy requests to in case of missing files
            // Very useful if you are working with a remote API or a backend that generates dynamic html
            // The value should be a valid url to the server you want to proxy to
            proxy: null,

            // Compile React Jsx to JavaScript
            jsx: true,

            // Compile Less to CSS
            less: true,

            // Compile Scss to CSS using node-sass
            scss: true,

            // Watch HTML-files and livereload on changes
            watchHtml: true,

            // Watch CSS bakground images and livereload on changes
            watchCssImages: true,

            // Run each image through the image processing pipeline exposed by express-processimage
            // Allows you to resize, recompress, change image format, rasterize SVG and much more
            // Reading the documentation is highly recommended: https://github.com/papandreou/express-processimage#express-processimage
            processimage: true,

            // Enable debug logging. VERY chatty!
            debug: false,

            // Translate the paths of incoming requests.
            // Think of it as a very primitive mod_rewrite that only works on request path prefixes.
            // For example, to translate all requests for /remoteDir/* to /localDir/* do this:
            // {
            //    '/remoteDir/': '/localDir/'
            // }
            //
            mappings: {},

            // Browser version configuration
            // This is used for autoprefixing, but may in the future also be used to browser version specific hacks
            browsers: [
                '> 1%',
                'last 2 versions',
                'Firefox ESR',
                'Opera 12.1'
            ]
        }
    });
};
```


License
-------

MIT
