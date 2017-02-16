'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var path = require('path');

    /**
     * Resolve external project resource as file path
     */
    function resolvePath(project, file) {
        return path.join(path.dirname(require.resolve(project)), file);
    }

    // configures browsers to run test against
    // any of [ 'PhantomJS', 'Chrome', 'Firefox', 'IE']
    var TEST_BROWSERS = ((process.env.TEST_BROWSERS || '').replace(/^\s+|\s+$/, '') || 'PhantomJS').split(/\s*,\s*/g);

    // project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        config: {
            sources: 'app',
            dist: 'dist',
            apacheURI: 'http://bpmncp.localhost/'
        },

        jshint: {
            src: [
                ['<%=config.sources %>']
            ],
            options: {
                jshintrc: true
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    debug: true,
                    // strip unnecessary built-ins
                    builtins: ['events'],
                    // make sure we do not include Node stubs unnecessarily
                    insertGlobalVars: {
                        process: function () {
                            return 'undefined';
                        },
                        Buffer: function () {
                            return 'undefined';
                        }
                    }
                },
                transform: [
                    ['stringify', {extensions: ['.bpmn', '.xml', '.css']}],
                    ['brfs', {global: true}]
                ]
            },
            watch: {
                options: {
                    watch: true
                },
                files: {
                    '<%= config.dist %>/app.js': ['<%= config.sources %>/app.js']
                }
            },
            app: {
                files: {
                    '<%= config.dist %>/app.js': ['<%= config.sources %>/app.js']
                }
            }
        },
        copy: {
            diagram_js: {
                files: [
                    {
                        src: resolvePath('diagram-js', 'assets/diagram-js.css'),
                        dest: '<%= config.dist %>/css/diagram-js.css'
                    }
                ]
            },
            bpmn_js: {
                files: [
                    {
                        expand: true,
                        cwd: resolvePath('bpmn-js', 'assets'),
                        src: ['**/*.*', '!**/*.js'],
                        dest: '<%= config.dist %>/vendor'
                    }
                ]
            },
            dmn_js: {
                files: [
                    {
                        expand: true,
                        cwd: resolvePath('dmn-js', 'assets'),
                        src: ['**/*.*', '!**/*.js'],
                        dest: '<%= config.dist %>/vendor'
                    }
                ]
            },
            app: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.sources %>/',
                        src: ['**/*.*', '!**/*.js'],
                        dest: '<%= config.dist %>'
                    }
                ]
            },
            toPHP: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.dist %>/',
                        src: ['**/*.*', '!index.html'],
                        dest: 'php/public/cp-modeler'
                    }
                ]
            }
        },
        less: {
            options: {
                dumpLineNumbers: 'comments',
                paths: [
                    'node_modules'
                ]
            },

            styles: {
                files: [
                    {'dist/css/app.css': 'styles/app.less'},
                    {'dist/css/dmn-js.css': 'node_modules/dmn-js/styles/dmn-js.less'},
                ]
            }
        },

        watch: {
            options: {
                livereload: true
            },

            samples: {
                files: ['<%= config.sources %>/**/*.*'],
                tasks: ['copy:app']
            },
            styles: {
                files: [
                    'styles/**/*.less',
                    'node_modules/bpmn-js-properties-panel/styles/**/*.less',
                    'app/clinical-pathways/css/**/*.less'
                ],
                tasks: [
                    'less'
                ]
            },
        },

        connect: {
            livereload: {
                options: {
                    port: 9013,
                    livereload: true,
                    hostname: 'localhost',
                    open: true,
                    base: [
                        '<%= config.dist %>'
                    ]
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
        },
        open: {
            apache: {
                path: '<%= config.apacheURI %>',
                app: 'Firefox'
            }
        }
    });

    // tasks

    grunt.registerTask('build', ['copy', 'less', 'browserify:app']);


    grunt.registerTask('auto-build', [
        'copy:diagram_js',
        'copy:bpmn_js',
        'copy:dmn_js',
        'copy:app',
        'less',
        'browserify:watch',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('release-php', [
        'copy:diagram_js',
        'copy:bpmn_js',
        'copy:dmn_js',
        'copy:app',
        'less',
        'browserify:watch',
        'copy:toPHP',
        'open'
        //'connect:livereload',
        //'watch'
    ]);

    grunt.registerTask('test', ['karma:single']);

    grunt.registerTask('auto-test', ['karma:unit']);

    grunt.registerTask('default', ['jshint', 'test', 'build']);
};
