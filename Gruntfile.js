module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-cssc');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    /* Watch Tasks */
        // server
        connect: {
            server: {
                options: {
                    port: 8989,
                    host: 'localhost',
                    open: "http://localhost:8989/index.html"
                }
            }
        },
        // compass
        compass: {
            dev: {
                options: {
                    sassDir: 'app/sass',
                    cssDir: 'assets/css'
                }
            }
        },
        // autoprefixer
        autoprefixer: {
            build: {
                expand: true,
                flatten: true,
                src: "assets/css/main.css",
                dest: "assets/css/"
            }
        },
        // watch
        watch: {
            sass: {
                files: ['app/sass/*.scss'],
                tasks: ['compass:dev', 'autoprefixer:build']
            },
            livereload: {
                options: {livereload: true},
                files: ['assets/css/*.css', 'app/*/*.js', 'app/*.js', '*.html', 'app/views/*.html']
            }
        },

    /* Validating Tasks */
        // jshint
        jshint: {
            js_target: {
                src: ['app/*.js', 'app/*/*.js']
            },
            options: {
                force: true
            }
        },
        // htmlhint
        htmlhint: {
            build: {
                options: {
                    'tag-pair': true,
                    'tagname-lowercase': true,
                    'attr-lowercase': true,
                    'attr-value-double-quotes': true,
                    'spec-char-escape': true,
                    'id-unique': true
                },
                src: ['*.html', 'app/views/*html']
            }
        },

    /* Finalizing Tasks */
        // css consolidate
        cssc: {
            build: {
                options: {
                    consolidateViaDeclarations: true,
                    consolidateViaSelectors: true,
                    consolidateMediaQueries: true
                },
                files: {
                    'assets/css/main.css': 'assets/css/main.css'
                }
            }
        },
        // minify
        cssmin: {
            build: {
                src: 'assets/css/main.css',
                dest: 'assets/css/main.css'
            }
        },
        concat: {
            dist: {
                src: ['app/*.js', 'app/*/*.js'],
                dest: 'assets/js/app.js'
            }
        },
        uglify: {
<<<<<<< 48a7a1c6826fcf539259eb41e31246d05c7a7d6f
            options: {
                mangle: false
            },
=======
>>>>>>> first commit
            my_target: {
                files: {
                    'assets/js/app.js': ['assets/js/app.js']
                }
            }
        }
    });

    grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('validate', ['jshint', 'htmlhint']);
    grunt.registerTask('finalize', ['cssc:build', 'cssmin:build', 'concat', 'uglify']);
};