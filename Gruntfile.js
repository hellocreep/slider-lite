module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		coffee:{},
		less:{},
		uglify:{
			options:{},
			build: {
				src: 'js/*.js',
				dest: 'js-build/*.js'
			}
		},
		watch:{

		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');



	grunt.registerTask('default', ['uglify']);
}