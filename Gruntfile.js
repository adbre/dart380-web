module.exports = function (grunt) {
  grunt.initConfig({
    // Watch task config
    watch: {
      sass: {
        files: "app/scss/*.scss",
        tasks: ['sass']
      }
    },
    // SASS task config
    sass: {
        dev: {
            files: {
                // destination         // source file
                "dist/css/styles.css" : "app/scss/styles.scss"
            }
        }
    },
    browserSync: {
        default_options: {
            bsFiles: {
                src: [
                    "dist/css/*.css",
                    "*.html"
                ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./"
                }
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.registerTask('default', ['browserSync', 'watch']);
};
