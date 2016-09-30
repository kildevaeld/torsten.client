
const gulp = require('gulp'),
    wpstream = require('webpack-stream'),
    webpack = require('webpack'),
    merge = require('merge2'),
    tsc = require('gulp-typescript'),
    babel = require('gulp-babel');

/*var JsonpTemplatePlugin = require('../../node_modules/webpack/lib/JsonpTemplatePlugin');
var FunctionModulePlugin = require('../../node_modules/webpack/lib/FunctionModulePlugin');
var NodeTargetPlugin = require('../../node_modules/webpack/lib/node/NodeTargetPlugin');
var NodeTemplatePlugin = require('../../node_modules/webpack/lib/node/NodeTemplatePlugin');
var LoaderTargetPlugin = require('../../node_modules/webpack/lib/LoaderTargetPlugin');
*/
var webpackOutput = {
    library: 'torsten',
    libraryTarget: 'umd',

    filename: 'torsten.js'
};

var webpackNode = {
    // do not include poly fills...
    console: false,
    process: false,
    global: false,
    buffer: false,
    __filename: false,
    __dirname: true
};


gulp.task('webpack', ['typescript'], () => {
    return gulp.src('lib/index.js')
        .pipe(wpstream({
            output: webpackOutput,
            /*target: function (compiler) {
                compiler.apply(
                    new JsonpTemplatePlugin(webpackOutput),
                    new FunctionModulePlugin(webpackOutput),
                    new NodeTemplatePlugin(webpackOutput),
                    new NodeTargetPlugin(webpackNode),
                    new LoaderTargetPlugin('web')
                );
            },*/
            node: webpackNode,
           /* module: {
                loaders: [
                    { test: /\.json/, loader: 'json-loader' },
                    { test: /stream.js$/, loader: 'ignore-loader' },
                    { test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] } },

                ]
            }*/

            externals: {
                "orange": "orange",
                "orange.request": {
                    root: ['orange','request'],
                    commonjs2: 'orange.request',
                    commonjs: 'orange.request',
                    amd: 'orange.request'
                }
            }
        })).pipe(gulp.dest('dist'))
});

gulp.task('webpack:bundle', ['typescript'], () => {
    return gulp.src('lib/index.js')
        .pipe(wpstream({
            output: {
                library: 'torsten',
                libraryTarget: 'umd',

                filename: 'torsten.bundle.js'
            },
            /*target: function (compiler) {
                compiler.apply(
                    new JsonpTemplatePlugin(webpackOutput),
                    new FunctionModulePlugin(webpackOutput),
                    new NodeTemplatePlugin(webpackOutput),
                    new NodeTargetPlugin(webpackNode),
                    new LoaderTargetPlugin('web')
                );
            },*/
            /*module: {
                loaders: [
                    { test: /\.json/, loader: 'json-loader' },
                    { test: /stream.js$/, loader: 'ignore-loader' },
                    
                    { test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] } },

                ]
            },*/
            node: webpackNode,
            resolve: {
                alias: {
                    "orange.request": process.cwd() + '/node_modules/orange.request/lib/browser.js'
                }
            }
        })).pipe(gulp.dest('dist'))
});

gulp.task('typescript', () => {
    var project = tsc.createProject('tsconfig.json')

    let p = project.src()
        .pipe(tsc(project))

    let js = p.js
    .pipe(babel({
        presets: ['es2015']
    }))
        

    return merge([
        js.pipe(gulp.dest('lib')),
        p.dts.pipe(gulp.dest('lib'))
    ]);

})

gulp.task('default', ['webpack', 'webpack:bundle'])


gulp.task('watch', () => {
    gulp.watch('./src/*.ts', ['webpack:bundle', 'webpack'])
})