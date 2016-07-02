module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    // configures browsers to run test against
    // any of [ 'PhantomJS', 'Chrome', 'Firefox', 'IE']
    var TEST_BROWSERS = ((process.env.TEST_BROWSERS || '').replace(/^\s+|\s+$/, '') || 'PhantomJS').split(/\s*,\s*/g);

    grunt.initConfig({
    // Watch task config
    watch: {
        sass: {
        files: "app/**/*.scss",
        tasks: ['sass']
        }
    },
    // SASS task config
    sass: {
        dev: {
            files: {
                // destination  // source file
                "dist/app.css": "app/app.scss"
            }
        }
    },
    browserSync: {
        default_options: {
            bsFiles: {
                src: [
                    "dist/app.css",
                    "dist/app.js",
                    "index.html"
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./"
                }
            }
        }
    },
    browserify: {
        options: {
            browserifyOptions: {
                debug: true,
                // strip unnecessary built-ins
                builtins: [ 'events' ],
                // make sure we do not include Node stubs unnecessarily
                insertGlobalVars: {
                    process: function () {
                        return 'undefined';
                    },
                    Buffer: function () {
                        return 'undefined';
                    }
                }
            }
        },
        watch: {
            options: {
                watch: true
            },
            files: {
                'dist/app.js': [ 'app/app.js' ]
            }
        },
        app: {
            files: {
                'dist/app.js': [ 'app/app.js' ]
            }
        }
    },
    karma: {
        options: {
            configFile: 'test/config/karma.unit.js'
        },
        single: {
            singleRun: true,
            autoWatch: false,
            browsers: TEST_BROWSERS
        },
        unit: {
            browsers: TEST_BROWSERS
        }
    }
    });

    grunt.registerTask('build', ['sass','browserify:app']);
    grunt.registerTask('test', []);
    grunt.registerTask('auto-build', ['browserSync', 'browserify:watch', 'watch']);
    grunt.registerTask('default', ['test', 'build']);
};
