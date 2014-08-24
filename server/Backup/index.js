var http = require('http'),
    express = require('express'),
    fs = require('fs'),
    child_process = require('child_process'),
    app = express(),
    JSONParse = require('./bin/JSONParse'),
    TexConverter = require('./bin/TexConverter');
var path = require('path');
var util = require('util');

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
    app.use('/images', express.static(process.cwd() + '/paper'));
});

//Allow CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

http.createServer(app).listen(60000, function(){
    console.log('Hello, World!');
});

app.get('/', function(req, res ){
    res.send("Hello, World!");
});

app.get('/compose', function(req, res){
    res.sendfile('./paper/paper.pdf');
});

app.post('/compose', function( req, res ){
    // var data = fs.readFileSync("sample.json");
    // data = JSON.parse(data);
    var myPaper = new JSONParse( req.body );
    var tex = myPaper.toTex();
    var bib = myPaper.toBib();
    var texConverter = new TexConverter();
    var outputTex

    if (fs.existsSync('./paper/paper.bbl')) {
        fs.unlinkSync('./paper/paper.bbl');
    }
    myPaper.writeToFile( tex, 'paper', './paper', function(texFile) {
        console.log('Tex File Generated...');
        outputTex = texFile;

        texConverter.toPdf( texFile, function(err, pdfFile) {
            if (err) {
                // Take some action
                console.log('PDF File Generation Error!');
                res.writeHead(500, {error: 'Some Problem Occured'});
                res.end();
            } else {
                console.log('PDF File Generated!');

                myPaper.writeToFile( bib, 'bibFile', './paper', function(bibFile, isEmpty){
                    if (isEmpty) {
                        // avoid extra cycles
                        texConverter.toPng( pdfFile, function(err, filesArray) {
                            if(err){
                                console.log('PNG Files Generation Error!');
                                res.writeHead(500, {error: 'PNG Not Rendered'});
                                res.end();
                            } else{
                                console.log('PNG Files Generated!');
                                res.json(filesArray);
                            }
                        });
                    } else {
                        texConverter.toBib(texFile, function (err, bibFile) {
                            if (err) {
                                console.log('BibTex Error!');
                                res.writeHead(500, {error: 'Some Problem Occured'});
                                res.end();
                            } else {
                                console.log('Bbl File Generated!');

                                texConverter.toPdf( outputTex, function(err, pdfFile) {
                                    if (err) {
                                        // Take some action
                                        console.log('PDF File2 Generation Error!');
                                        //res.writeHead(500, {error: 'Some Problem Occured'});

                                    } else {
                                        console.log('PDF File2 Generated!');

                                        texConverter.toPdf( outputTex, function(err, pdfFile) {
                                            if (err) {
                                                // Take some action
                                                console.log('PDF File3 Generation Error!');
                                                //res.writeHead(500, {error: 'Some Problem Occured'});
                                                //res.end();
                                            } else {
                                                console.log('PDF File3 Generated!');
                                                texConverter.toPng( pdfFile, function(err, filesArray) {
                                                    if(err){
                                                        console.log('PNG Files Generation Error!');
                                                        res.writeHead(500, {error: 'PNG Not Rendered'});
                                                        res.end();
                                                    } else{
                                                        console.log('PNG Files Generated!');
                                                        res.json(filesArray);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});

app.post('/upload', function(req, res){
    console.log('Upload POST');

    for (var file in req.files) {
        fs.renameSync(req.files[file].path, path.dirname(req.files[file].path) + '/' + file);
    }

    res.end('Received');
});

app.get('/result', function(req, res) {
    res.sendfile('paper.pdf');
});
