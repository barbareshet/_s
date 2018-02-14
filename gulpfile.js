/**
 * Created by ido on 10/3/2017.
 */
/**
 * based on https://www.sitepoint.com/wordpress-theme-automation-with-gulp/...
 * */
var project = 'ido_s';
var build 		= './buildtheme/'; // Files that you want to package into a zip go here
var buildInclude 	= [
        // include common file types
        '**/*.php',
        '**/*.html',
        '**/*.css',
        '**/*.js',
        '**/*.svg',
        '**/*.ttf',
        '**/*.otf',
        '**/*.eot',
        '**/*.woff',
        '**/*.woff2',

        // include specific files and folders
        'screenshot.png',

        // exclude files and folders
        '!node_modules/**/*',
        '!assets/dev/**/*'

    ];

require('es6-promise').polyfill();
var gulp            =   require('gulp');

//scss vars
var sass            =   require('gulp-sass');
var autoprefixer    =   require('gulp-autoprefixer');
var rtlcss          =   require('gulp-rtlcss');
var rename          =   require('gulp-rename');
var plumber         =   require('gulp-plumber');
var gutil           =   require('gulp-util');
var minifyCSS       =   require('gulp-minify-css');
//js vars
var concat          =   require('gulp-concat');
var jshint          =   require('gulp-jshint');
var uglify          =   require('gulp-uglify');

//img
var imagemin        =   require('gulp-imagemin');

// browserSync
var browserSync     =   require('browser-sync').create();
var reload          =   browserSync.reload;

// CSS tasks
gulp.task('sass', function() {
    return gulp.src('assets/dev/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./assets/dist/css'))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(rtlcss())                     // Convert to RTL
        .pipe(rename({ basename: 'rtl' }))  // Rename to rtl.css
        .pipe(gulp.dest('./assets/dist/css'));             // Output RTL stylesheets (rtl.css)
});

// JS tasks
var bsJS        = 'assets/dev/js/bootstrap.min.js',
    slickJS     = 'assets/dev/js/slick.min.js',
    fancyBox    = 'assets/dev/js/jquery.fancybox.min.js',
    masonry     = 'assets/dev/js/masonry.pkgd.min.js',
    mainJS      = 'assets/dev/js/app.js';

gulp.task('js', function() {
    return gulp.src([bsJS, slickJS,fancyBox,masonry, mainJS])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('assets/dist/js'))
});

//images
gulp.task('images', function() {
    return gulp.src('assets/dev/img/*')
        .pipe(plumber({errorHandler: onError}))
        .pipe(imagemin({optimizationLevel: 7, progressive: true}))
        .pipe(gulp.dest('assets/dist/img'));
});

// Util Tasks
gulp.task('timestamp', function () {
    var date = new Date();
    console.log('last task was at: ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
});
gulp.task('watch', function() {
    browserSync.init({
        files: ['./**/*.php'],
        proxy: 'http://localhost/shablul/',
    });
    gulp.watch('assets/dev/scss/**/*.scss', ['sass',reload]);
    gulp.watch('assets/dev/img/*', ['images']);
    gulp.watch('assets/dev/js/*.js', ['js', reload]);
});

var onError = function (err) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};
gulp.task('default', [
    'timestamp',
    'sass',
    'js',
    'images',
    'watch',
    'timestamp'
]);
