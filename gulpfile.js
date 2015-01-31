var gulp = require('gulp'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    fs = require('fs'),
    jsStringEscape = require('js-string-escape'),
    watch = require('gulp-watch');

var pkg = require('./package.json');

// Common tasks

var insertManifestData = function (stream) {
    return stream
        .pipe(replace('{{APP_NAME}}', pkg.title))
        .pipe(replace('{{APP_DESCRIPTION}}', pkg.description))
        .pipe(replace('{{APP_VERSION}}', pkg.version));
}

gulp.task('build-clean', function () {
    return gulp.src('build', { read: false })
        .pipe(clean());
});

gulp.task('release-clean', function () {
    return gulp.src('dist', { read: false })
        .pipe(clean());
});

gulp.task('clean', ['build-clean', 'release-clean']);

// Userscript tasks

var buildUserScriptJs = function (isRelease) {
    // Prepare files list
    var src = [
        'build/userscript/_temp/manifest.txt',
        'src/scripts/app.js',
        'src/scripts/*.js',
        'src/.userscript/scripts/*.js'
    ];
    if (isRelease) {
        src.push('!src/scripts/debug.js');
    };

    return gulp.src(src)
        .pipe(replace('{{APP_EMBEDDED_INJECT_SCRIPTS}}', function () {
            return jsStringEscape(fs.readFileSync('build/userscript/_temp/injects.js', 'utf8'));
        }))
        .pipe(replace('{{APP_EMBEDDED_STYLES}}', function () {
            return fs.readFileSync('build/userscript/_temp/main.css', 'utf8');
        }))
        .pipe(concat('husot.user.js'))
        .pipe(gulp.dest('build/userscript'));
}

gulp.task('build-userscript-css', ['build-clean'], function () {
    return gulp.src('src/styles/*.css')
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('build/userscript/_temp'));
});

gulp.task('build-userscript-injects', ['build-clean'], function () {
    return gulp.src('src/scripts/injects/*.js')
        .pipe(concat('injects.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/userscript/_temp'));
});

gulp.task('build-userscript-manifest', ['build-clean'], function () {
    return insertManifestData(gulp.src('src/.userscript/manifest.txt'))
        .pipe(gulp.dest('build/userscript/_temp'));
});

gulp.task('build-userscript-js', ['build-userscript-manifest', 'build-userscript-css', 'build-userscript-injects'], function () {
    return buildUserScriptJs(false);
});

gulp.task('build-userscript', ['build-userscript-js', 'build-clean']);

gulp.task('release-userscript-js', ['build-userscript-manifest', 'build-userscript-css', 'build-userscript-injects'], function () {
    return buildUserScriptJs(true);
});

gulp.task('release-userscript', ['release-userscript-js', 'release-clean'], function () {
    return gulp.src([
            'build/userscript/husot.user.js'
        ])
        .pipe(gulp.dest('dist/userscript'));
});

// Chrome tasks

var buildChromeJs = function (isRelease) {
    // Prepare files list
    var src = [
        'src/scripts/app.js',
        'src/scripts/*.js',
        'src/.chrome/scripts/*.js',
    ];
    if (isRelease) {
        src.push('!src/scripts/debug.js');
    };

    return gulp.src(src)
        .pipe(concat('content.js'))
        .pipe(gulp.dest('build/chrome'));
};

gulp.task('build-chrome-manifest', ['build-clean'], function () {
    return insertManifestData(gulp.src('src/.chrome/manifest.json'))
        .pipe(gulp.dest('build/chrome'));
});

gulp.task('build-chrome-css', ['build-clean'], function () {
    return gulp.src('src/styles/*.css')
        .pipe(concat('content.css'))
        .pipe(gulp.dest('build/chrome'));
});

gulp.task('build-chrome-js', ['build-clean'], function () {
    return buildChromeJs(false);
});

gulp.task('build-chrome-injects', ['build-clean'], function () {
    return gulp.src('src/scripts/injects/*.*')
        .pipe(concat('injects.js'))
        .pipe(gulp.dest('build/chrome'));
});

gulp.task('build-chrome-vendor', ['build-clean'], function () {
    return gulp.src('vendor/*.*')
        .pipe(gulp.dest('build/chrome/vendor'));
});

gulp.task('build-chrome-images', ['build-clean'], function () {
    return gulp.src('src/.chrome/images/*.png')
        .pipe(gulp.dest('build/chrome/images'));
});

gulp.task('build-chrome', ['build-chrome-manifest', 'build-chrome-css', 'build-chrome-js', 'build-chrome-injects', 'build-chrome-vendor', 'build-chrome-images']);

gulp.task('release-chrome-js', ['release-clean'], function () {
    return buildChromeJs(true);
});

gulp.task('release-chrome', ['build-chrome-manifest', 'build-chrome-css', 'build-chrome-injects', 'build-chrome-vendor', 'build-chrome-images', 'release-chrome-js', 'release-clean'], function () {
    return gulp.src([
            'build/chrome/**/*'
        ])
        .pipe(gulp.dest('dist/chrome'));
});

// Main tasks

gulp.task('build', ['build-userscript', 'build-chrome']);

gulp.task('release', ['release-userscript', 'release-chrome']);

gulp.task('watch', function () {
    gulp.watch(
        [
            'src/**/*.js',
            'src/**/*.css',
            'src/.chrome/**/*.js',
            'src/.chrome/**/*.css',
            'src/.chrome/**/manifest.*',
            'src/.userscript/**/*.js',
            'src/.userscript/**/*.css',
            'src/.userscript/**/manifest.*',
        ],
        ['build']);
});

gulp.task('default', ['build']);
