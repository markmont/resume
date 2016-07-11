'use strict';

var dest = 'www'; // destination folder

var gulp = require('gulp');
var fs = require('fs');


// Include plugins
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});


// Copy fonts to destination folder
gulp.task('fonts', function() {
    gulp.src(['**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.ttf', '**/*.otf'])
        .pipe(plugins.flatten())
        .pipe(gulp.dest(dest));
});


// Concatenate and minify Javascript and put it in destination folder
gulp.task('js', function() {
    gulp.src(plugins.mainBowerFiles().concat(['markmont-resume.js']))
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.print())
        .pipe(plugins.concat('markmont-resume.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dest));
});


// Concatenate and minify CSS and put it in destination folder
//   don't rebuild from SASS as this might change Bootstrap SASS variables
gulp.task('css', function() {
    gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css',
              'bower_components/font-awesome/css/font-awesome.css',
              'markmont-resume.scss'])
        .pipe(plugins.replace('../fonts/', ''))
        .pipe(plugins.print())
	.pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.concat('markmont-resume.css'))
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(dest));
});


// Copy HTML and favicons to destination folder
gulp.task('html', function() {
    gulp.src(['favicon*'])
        .pipe(gulp.dest(dest));
    gulp.src(['markmont-resume.html'])
        .pipe(plugins.nunjucksRender())
        .pipe(plugins.rename('index.html'))
        .pipe(gulp.dest(dest));
});


// Install bower components automatically
gulp.task('bower', function() { 
    return plugins.bower();
});


gulp.task('watch', function() {
  gulp.watch(['markmont-resume.js', 'bower_components/**/*.js'], ['js']);
  gulp.watch(['markmont-resume.scss', 'bower_components/**/*.css'], ['css', 'fonts']);
  gulp.watch(['markmont-resume.html', 'favicon*'], ['html']);
});


gulp.task('default', ['bower', 'fonts', 'js', 'css', 'html']);

