// GLOBALS
var GLOBALS = {
  HOST_PORT: 60000,
  CLEAN_SCRIPT: 'clean_files.sh',
  COMPOSE_SCRIPT: 'compose.sh',
  COMPOSE_TIMEOUT: 15000
};

var fs = require('fs'),
    express = require('express'),  // DO NOT use express 4.0! Need to figure out changes to bodyParser()
    child_process = require('child_process'),
    path = require('path'),
    tu = require('./lib/tex-util.js'),
    jsonToTex = require('./lib/json-to-tex.js'),
    jsonToBib = require('./lib/json-to-bib.js'),
    _ = require('nimble');

var app = express();

app.configure( function() {
    app.use(express.bodyParser({
        keepExtension: true,
        uploadDir: process.cwd() + '/paper/img'
    }))
    app.use(function(req, res, next) {
        var oneof = false;
        if(req.headers.origin) {
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            oneof = true;
        }
        if(req.headers['access-control-request-method']) {
            res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
            oneof = true;
        }
        if(req.headers['access-control-request-headers']) {
            res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
            oneof = true;
        }
        if(oneof) {
            res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
        }

        // intercept OPTIONS method
        if (oneof && req.method == 'OPTIONS') {
            res.send(200);
        }
        else {
            next();
        }
    });
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    app.use('/images', express.static(process.cwd() + '/result'));
});

//Allow CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// POST multipart image upload
app.post('/upload', function(req, res){
    for (var file in req.files) {
        fs.renameSync(req.files[file].path, path.dirname(req.files[file].path) + '/' + file);
    }
    res.end('Received Image Upload');
});

// Main Compose REST API
app.post('/compose', function(req, res) {
  // console.log(req.body);

  (function(data) {
    var tex = '';

    _.series([
      // Cleanup existing files in result
      function(callback) {
        child_process.exec('sh ' + GLOBALS.CLEAN_SCRIPT, function() {
          console.log('Cleaned up existing files...');
          callback();
        });
      },
      // Meta -> Tex
      function(callback) {
        var meta = [];
        if (data.meta.textSize !== 'auto') {
          meta.push(data.meta.textSize);
        }
        meta.push(data.meta.documentMode);
        if (data.meta.paperSize !== 'auto') {
          meta.push(paperSize);
        }
 
        tex += tu.command('documentclass', 'IEEEtran', meta);
        callback();
      },
      // Contents -> Tex
      function(callback) {
        tex += tu.command('usepackage', 'graphicx');
        tex += tu.command('usepackage', 'flushend');
        tex += tu.command('begin', 'document');

        tex += tu.command('title', tu.replaceSpecialChars(data.contents.title).replace(/\n/g, tu.slashLineBreak));
        tex += jsonToTex.renderAuthorBlock(data.contents.authors);
        tex += tu.command('maketitle');

        tex += jsonToTex.renderAbstractBlock(data.contents.abstract);
        tex += jsonToTex.renderKeywords(data.contents.keywords);

        tex += jsonToTex.renderSections(data.contents.sections);

        if (data.bibliography && data.bibliography.length > 0) {
          tex += tu.command('bibliographystyle', 'IEEEtran');
          tex += tu.command('nocite', '*'); // TODO: Remove this!
          tex += tu.command('bibliography', 'bibFile');
        }

        tex += tu.command('end', 'document');

        // Write Tex to file
        fs.writeFile(process.cwd() + '/paper/paper.tex', tex, function(err) {
          if (err) {
            console.log('Error writing tex!');
          }
          callback();
        });
      },
      // Bibliography -> bib
      function(callback) {
        var bib = '';
        bib += jsonToBib.renderBib(data.bibliography);

        fs.writeFile(process.cwd() + '/paper/bibFile.bib', bib, function(err) {
          if (err) {
            console.log('Error writing bib!');
          }
          callback();
        });
      },
      // Compose
      function(callback) {
        child_process.exec('sh ' + GLOBALS.COMPOSE_SCRIPT, {timeout: GLOBALS.COMPOSE_TIMEOUT}, function() {
          console.log('Compose Done!');
          callback();
        });
      },
      // List PGN files and return array.
      function(callback) {
        var resultFiles = [];
        fs.readdir(process.cwd() + '/result', function(err, files) {
          if (err) {
            console.log('result file listing error!');
            res.writeHead(500, {error: 'Result Listing Error!'});
            callback();
          }

          _.each(files, function(file) {
            if (file.lastIndexOf('.png') !== -1) {
              resultFiles.push(file + '?q=' + Date.now());
            }
          });

          res.json(resultFiles);
          res.end();
          callback();
        });
      }
    ]);
  }(req.body));
});

app.listen(GLOBALS.HOST_PORT, function() {
  console.log('Typeset Server Listening on Port: ' + GLOBALS.HOST_PORT);
});