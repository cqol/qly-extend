var path = require("path");


module.exports = function (grunt) {
	var today = grunt.template.today("yyyy-mm-dd HH:MM:ss");
	var timestamp = grunt.template.today("mmddHHMM");

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},

			ttk: {
				files: {
					src: ['ttk_extend/js/*.js', 'ttk_extend/js/login/*.js', '!ttk_extend/js/lib/*.js']
				}
			}
		},

		uglify: {
			options: {
				banner: '/* @date:' + today + ' */\n',
				mangle: false
			},
			ttk: {
				files: [
					{
						expand: true,
						cwd: 'dist/ttk_sogo_extend/js/login/',
						src: '*.js',
						dest: 'dist/ttk_sogo_extend/js/login/'
					},
					{
						expand: true,
						cwd: 'dist/ttk_sogo_extend/js/',
						src: '**/*.js',
						dest: 'dist/ttk_sogo_extend/js/'
					}
				]
			}
		},

		replace: {
			sogo: {
				options: {
					patterns: [
						{
							match: /chrome\./g,
							replacement: function () {
								return 'sogouExplorer.'; // replaces "foo" to "bar"
							}
						}
					]
				},
				files: [
					{expand: true, flatten: true, src: ['dist/ttk_sogo_extend/js/background.js'], dest: 'dist/ttk_sogo_extend/js/'},
					{expand: true, flatten: true, src: ['dist/ttk_sogo_extend/js/content.js'], dest: 'dist/ttk_sogo_extend/js/'}
				]
			},
		},

		watch: {
			handlebars: {
				files: ['qly_extend/hbs/**/*.hbs'],
				tasks: 'handlebars'
			},
			compass: {
				files: ["qly_extend/scss/**/*.scss", "qly_extend/img/{,*/}*"],
				tasks: 'compass'
			}
		},

		handlebars: {
			options: {
				amd: true,
				processName: function (fp) {
					var _t = path.resolve(fp).replace(path.join(__dirname, "qly_extend/hbs/"), ""),
						_a = _t.split(path.sep);
					_t = _a.join(path.sep);
					return _t.toLowerCase().replace(/\.hbs$/, "");
				}
			},
			build: {
				files: {
					"qly_extend/js/qly/templates.js": "qly_extend/hbs/{,*/}/{,*/}/*.hbs"
				}
			}
		},

		compass: {
			taobao: {
				options: {
					sassDir: 'qly_extend/scss/',
					cssDir : 'qly_extend/css/',
					generatedImagesDir: "qly_extend/img/generated",
					imagesDir: "qly_extend/img/",
					httpImagesPath: "/qly_extend/img",
					httpGeneratedImagesPath: "/qly_extend/img/generated",
					relativeAssets: false,
					outputStyle : 'compressed'
				}
			}
		},

		cssmin: {
			options: {
				banner: '/* @date:' + today + ' */'
			},
			minify: {
				expand: true,
				cwd: 'dist/ttk_sogo_extend/css/',
				src: ['*.css'],
				dest: 'dist/ttk_sogo_extend/css/',
				ext: '.css'
			}
		},
		copy: {
			ttk: {
				files: [

					{expand: true, cwd: 'ttk_extend/', src: ['**/*', '!manifest.json'], dest: 'dist/ttk_sogo_extend/'}
				]
			}
		},
		clean: {
			base: {
				src: ['copy', 'build', 'dist/ttk_sogo_extend']
			}
		},
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-spritesmith');

	grunt.loadNpmTasks('grunt-contrib-cssmin');

	//淘同款入口
	grunt.registerTask('ttk', 'ttk extend', function () {
		//grunt.task.run('jshint:ttk');
		grunt.task.run('clean');

		grunt.task.run('copy:ttk');
		grunt.task.run('uglify:ttk');
		grunt.task.run('cssmin');
		grunt.task.run('replace:sogo');

	});

	grunt.registerTask('sogo', 'ttk extend', function () {
		grunt.task.run('replace:sogo');
	});

	// Default task(s).
	grunt.registerTask('default', ['uglify']);

};