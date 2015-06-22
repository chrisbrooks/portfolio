var paths = {
	build: 'app/build/',
	src: 'app/src/',
	assets: 'app/src/assets/',
	bower: 'bower_components/'
}

var scriptsList = {
	'app/build/scripts/combined.min.js': [
		paths.assets + 'scripts/custom/initialize.js'
	],
	'app/build/scripts/plugins.min.js': [
		paths.bower + 'jquery.easing/js/jquery.easing.js',
		paths.bower + 'jquery.lazyLoad/jquery.lazyLoad.js',
		paths.assets + 'scripts/vendor/jquery.nav.js',
		paths.assets + 'scripts/vendor/viewportchecker.js'
	]
};

module.exports = function(grunt) {

	grunt.initConfig({

		jshint: {

			files: paths.assets + 'scripts/custom/*.js',

			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},

		htmlmin: {
			development : {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'app/build/index.html': 'app/build/index.html'
				}
			}
		},

		uglify: {

			development : {
				options: {
					compress: true
				},
				files: scriptsList
			},

			release : {
				files: scriptsList
			}
		},

		sass: {

			development: {
				options: {
					style: 'compressed'
				},
				files: {
					'app/build/styles/style.css': paths.assets + 'styles/style.scss',
				}
			},

			release: {
				options: {
					style: 'compressed'
				},
				files: {
					'app/build/styles/style.css': paths.assets + 'styles/style.scss',
				}
			}
		},

		autoprefixer: {

			build: {
				expand: true,
				flatten: true,
				src: paths.build + 'styles/**/*.css',
				dest: paths.build + 'styles/'
			}
		},

		copy: {

			images: {
				files: [{
					expand: true,
					cwd: paths.assets + 'images',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: paths.build + 'images/'
				}]
			},

			media: {
				files: [{
					expand: true,
					cwd: paths.assets + 'media',
					src: ['**/*.{png,jpg,gif,svg}'],
					dest: paths.build + 'media/'
				}]
			},

			data: {
				files: [{
					expand: true,
					cwd: 'app/src/data',
					src: ['**/*.json'],
					dest: paths.build + 'data/'
				}]
			},

			fonts: {
				files: [
					{
						expand: true,
						cwd: paths.assets + 'fonts',
						src: ['**/*.{eot,svg,ttf,woff}'],
						dest: paths.build + 'fonts/'
					}
				]
			},

			videos: {
				files: [{
					expand: true,
					cwd: paths.assets + 'video',
					src: ['**/*'],
					dest: paths.build + 'video/'
				}]
			},

			pdf: {
				files: [{
					expand: true,
					cwd: paths.assets,
					src: ['**/*.pdf'],
					dest: paths.build + ''
				}]
			}
		},

		clean: {

			build: {
				src: [paths.build + '']
			}
		},

		connect: {

			server: {
				options: {
					base: paths.build + '',
					hostname: '*',
					keepalive: false,
					livereload: false,
					open: {
						target: 'http://localhost:8000'
					},
					port: 8000,
					middleware: function(connect, options, middlewares) {

						middlewares.unshift(function (req, res, next) {

							var fs = require('fs');
							var path = require('path');
							var support = ['POST', 'PUT', 'DELETE'];

							if (support.indexOf(req.method.toUpperCase()) != -1) {
								var filepath = path.join(options.base[0], req.url);
								if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
									return res.end(fs.readFileSync(filepath));
								}
							}

							return next();
						});

						return middlewares;
					}
				}
			}
		},

		assemble: {

			options: {
				data: paths.src + 'data/**/*.json',
				prettify: {
					indent: 4
				},
				marked: {
					sanitize: false
				},
				production: true,
				layoutdir: paths.src + 'layouts',
				partials: [paths.src + 'partials/**/*.hbs'],
				layout: 'default.hbs'
			},

			pages: {
				files: [
					{
						expand: true,
						cwd: paths.src + 'pages',
						src: ['**/*.hbs'],
						dest: 'app/build/'
					}
				]
			},
		},

		watch: {

			// Watch for markup changes
			markup: {
				files: '**/*.hbs',
				tasks: ['assemble'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

			data: {
				files: paths.src + 'data/**/*.json',
				tasks: ['copy:data'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

			// Run SASS compliler when precompiled files are changed
			styles: {
				files: paths.assets + 'styles/**/*.scss',
				tasks: ['sass:development'],
				options: {
					livereload: false,
					spawn: false
				}
			},

			images: {
				files: [paths.assets + 'images/**/*.{png,jpg,gif}'],
				tasks: ['copy:images'],
				options: {
					livereload: false,
					interrupt: true
				}
			},


			fonts: {
				files: [paths.assets + 'fonts/**/*.{eot,svg,ttf,woff}'],
				tasks: ['copy:fonts'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

			media: {
				files: [paths.assets + 'media/**/*.{png,jpg,gif}'],
				tasks: ['copy:media'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

			videos: {
				files: [paths.assets + 'video/**/*.{mp4,ogv,webm}'],
				tasks: ['copy:videos'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

			scripts: {
				files: [paths.assets + 'scripts/**/*.js'],
				tasks: ['uglify:development'],
				options: {
					livereload: false,
					interrupt: true
				}
			},

		},

	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	// Register task(s) to run when 'grunt' command is executed
	grunt.registerTask('default', ['development']);

	// Register task(s) to run when 'grunt development' command is executed
	grunt.registerTask('development', [
		'jshint',
		'clean',
		'sass:development',
		'autoprefixer',
		'copy',
		'uglify:development',
		'assemble',
		'htmlmin',
		'connect',
		'watch'
	]);

	// Register task(s) to run when 'grunt release' command is executed
	grunt.registerTask('release', [
		'clean',
		'sass:release',
		'autoprefixer',
		'copy',
		'uglify:release',
		'assemble'
	]);

};
