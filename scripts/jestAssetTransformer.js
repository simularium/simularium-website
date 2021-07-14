/*
Transform asset files for Jest so that require('logo.jpg') returns 'logo', for example.
From https://jestjs.io/docs/webpack#mocking-css-modules
*/

const path = require('path');

module.exports = {
    process(src, filename, config, options) {
        return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';';
    },
};