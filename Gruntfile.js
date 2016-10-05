module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

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
                    "assets/**/*",
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
    }
    });

    grunt.registerTask('build', ['sass','browserify:app']);
    grunt.registerTask('auto-build', ['sass', 'browserSync', 'browserify:watch', 'watch']);
    grunt.registerTask('default', ['build']);
};
