var config       = require('../config')
if(!config.tasks.html) return

var browserSync  = require('browser-sync')
var data         = require('gulp-data')
var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var handleErrors = require('../lib/handleErrors')
var htmlmin      = require('gulp-htmlmin')
var path         = require('path')
var render       = require('gulp-nunjucks-render')
var fs           = require('fs')

var exclude = path.normalize('!**/{' + config.tasks.html.excludeFolders.join(',') + '}/**')

var paths = {
  src: [path.join(config.root.src, config.tasks.html.src, '/**/*.{' + config.tasks.html.extensions + '}'), exclude],
  dest: path.join(config.root.dest, config.tasks.html.dest),
  colourSassFile: path.join(config.root.src, config.tasks.html.colourSassFile)
}



var names = [
  'primary', 
  'secondary',
  'tertiary',
  'quaternary',
  'quinary',
  'senary',
  'septenary',
  'octonary',
  'nonary',
  'denary'
];

var cols = {};
var colsArr = [];
var socCols = [];

function titleize(string) {
  var title = string.split('-').join(' ');
  return title[0].toUpperCase() + title.slice(1);
}

function sortCols(obj) {
  var sortedArr = [];
  for (var i = 0; i < names.length; i ++) {
    for (var r in obj) {
      if (obj[r].var.indexOf(names[i]) >= 0) {
        sortedArr.push(obj[r]);
        continue;
      }
    }
  }
  return sortedArr;
}

var getColourData = function() {
  var fileContents = fs.readFileSync(paths.colourSassFile, 'utf8');
  var lines = fileContents.split('\n');
  
  for (var i = 0; i < lines.length; i ++) {
    var line = lines[i];

    if (line.indexOf('$col-') === 0) {
      var varName = line.substring(0, line.indexOf(":"));
      var shortVarName = line.substring(5, line.indexOf(":"));
      var col = line.substring(line.indexOf(" "), line.indexOf(";"));

      var colObj = {
        'col': col.toString(),
        'var': varName,
        'name': titleize(shortVarName)
      };

      if (line.indexOf('$col-social-') === 0) {
        var shortVarName = line.substring(12, line.indexOf(":"));
        colObj.name = titleize(shortVarName);
        socCols.push(colObj);
      } else {
        cols[varName] = colObj;
      }
    }
  }

  colsArr = sortCols(cols);

  var finalColArr = {
    brand: colsArr.slice(0, 3),
    base: colsArr.slice(3, 7),
    feedback: colsArr.slice(7, 10),
    social: socCols
  }

  return finalColArr;
}



var getData = function(file) {
  var dataPath = path.resolve(config.root.src, config.tasks.html.src, config.tasks.html.dataFile)
  var data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  
  data.colours = getColourData();
  return data;
}

var htmlTask = function() {

  return gulp.src(paths.src)
    .pipe(data(getData))
    .on('error', handleErrors)
    .pipe(render({
      path: [path.join(config.root.src, config.tasks.html.src)],
      envOptions: {
        watch: false
      }
    }))
    .on('error', handleErrors)
    .pipe(gulpif(global.production, htmlmin(config.tasks.html.htmlmin)))
    .pipe(gulp.dest(paths.dest))
    .on('end', browserSync.reload)

}

gulp.task('html', htmlTask)
module.exports = htmlTask
