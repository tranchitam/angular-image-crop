module.exports = function (grunt) {
    grunt.initConfig({
        copy: {
            build: {
                cwd: 'src',
                src: ['**'],
                dest: 'dist',
                expand: true
            }
        },
        clean: {
            build: {
                src: ['dist']
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true
                },
                files: {
                    'dist/ngImageCrop.min.js': ['dist/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', 'Copy, minify and uglify javascript files', ['clean', 'copy', 'uglify']);
};