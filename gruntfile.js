module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                options: {
                    paths: ['src/stylus'],
                    define: {"cdn_root" : "<%= pkg.deploy.cdn_root %>"},
                    use: [
                        
                    ],
                    import: [      //  @import 'foo', 'bar/moo', etc. into every .styl file
                      
                    ]
                },
                files: {
                    'dist/css/styles.css': 'src/stylus/index.styl', // 1:1 compile
                }
            }
       
        },
        concat: {
          options: {
            // define a string to put between each file in the concatenated output
            separator: ';'
          },
          
          dist: {
            // the files to concatenate
            src: [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/three/three.js',
            'src/vendor/soundmanager2/script/soundmanager2-jsmin.js',
            'src/vendor/greensock-js/src/minified/TweenLite.min.js',
            'src/js/**/*.js'
            ],
            // the location of the resulting JS file
            dest: 'dist/js/<%= pkg.name %>.js'
          }
        },
        uglify: {
            options: {
            // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
                }
            }
        },
        jshint: {
            // define the files to lint
            files: ['gruntfile.js', 'src/js/**/*.js' ],
            // configure JSHint (documented at http://www.jshint.com/docs/)
            options: {
            // more options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>' ,  '<%= stylus.compile.options.paths +"/**/*.styl" %>'],
            tasks: ['jshint' , 'concat' , 'stylus' ]
        },      
        connect: {
            server: {
                options: {
                    port:3001,
                    base: "./dist"

                }
            }

        }      

    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-stylus');

    grunt.loadNpmTasks('grunt-contrib-connect');

  

    grunt.registerTask('default', ['jshint', 'concat','stylus', 'connect' , 'watch']);
    grunt.registerTask('dist', ['jshint', 'concat', 'uglify' , 'stylus' ]);

};