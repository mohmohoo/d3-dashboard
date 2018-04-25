const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const gulpMocha = require('gulp-mocha');
const env = require('gulp-env');
const superTest = require('supertest');

gulp
    .task('default', () => {
        nodemon({
            script: 'app.js',
            ext: 'js',
            env: {
                port: 80,
                env: 'development'
            },
            ignore: [
                './node_modules'
            ]
        })
    })
    .on('restart', () => {
        console.log('Restarting');
    });


gulp
    .task('test', () => {
        env({ vars: { ENV: 'Test' } })
        gulp.src('tests/*.js', { read: false })
        .pipe(gulpMocha({ reporter: 'nyan' }))
    });
    
