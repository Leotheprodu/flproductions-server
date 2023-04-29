const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('copy-js', function () {
    return gulp
        .src([
            './**/*.js',
            './logs',
            './storage',
            './**/*.ejs',
            '!./node_modules/**',
            '!./gulpfile.js',
        ])
        .pipe(gulp.dest('./dist'));
});

gulp.task('compile-ts', () => {
    return tsProject.src().pipe(tsProject()).pipe(gulp.dest('dist'));
});

gulp.task('copy-package-json', function () {
    return gulp.src('./package.json').pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.series('copy-js', 'compile-ts', 'copy-package-json'));
