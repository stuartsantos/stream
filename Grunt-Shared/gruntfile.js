module.exports = function(grunt) {
    // 1. All configuration goes here 
    const sass = require('node-sass');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //*************************************************************
        //npm install grunt-contrib-uglify --save-dev
        uglify: {
            prod: {
                options: {
                    output: {comments: "some"}
                },
                src: [
                    'src/js/JQ-Bootstrap3.3.5.js',
                    'src/js/JQ-Actual.js',
                    'src/js/JQ-EqualHeight.js',
                    'src/js/JQ-CustomFunctions.js',
                    'src/js/JS-iOS_OrientationChange.js'
                ],
                dest: 'js/script.min.js'
            },
            uat: {
                options: {
                    beautify: true,
                    compress: {unused: false},
                    mangle: false,
                    compress: false,
                    output: {comments: "all"}
                },
                src: [
                    'src/js/JQ-Bootstrap3.3.5.js',
                    'src/js/JQ-Actual.js',
                    'src/js/JQ-EqualHeight.js',
                    'src/js/JQ-CustomFunctions.js',
                    'src/js/JS-iOS_OrientationChange.js'
                ],
                dest: 'js/script.min.js'
            }
        },
        //*************************************************************
        //npm install grunt-sass --save-dev
        sass: {
            prod: {
                options: {
                    implementation: sass,
                    outputStyle:'compressed'
                },
                src: 'src/scss/application.scss',
                dest: 'css/styles.css'
            },
            uat: {
                options: {
                    implementation: sass,
                    outputStyle:'expanded'
                },
                src: 'src/scss/application.scss',
                dest: 'css/styles.css'
            }
        },
        //*************************************************************
        //npm install grunt-contrib-watch --save-dev
        watch: {
            js: {
                files:['src/js/*.js'],
                tasks:['uglify:uat']
            },
            css: {
                files:['src/scss/**/*.scss'],
                tasks:['sass:uat']
            }
        }

    });
    //*************************************************************
    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //*************************************************************
    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['uglify:uat','sass:uat']);
    grunt.registerTask('prod', ['uglify:prod','sass:prod']);

    //*************************************************************

};