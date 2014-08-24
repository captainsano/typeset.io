//TexConverter.js

/* Calls other processes to convert the .tex into other formats */
var spawn = require("child_process").spawn;
var execFile = require("child_process").execFile
var fs = require('fs');

function TexConverter() {

}

TexConverter.prototype.toPdf = function( fileName, callback ){
    execFile('pdflatex', ['-output-directory', process.cwd() + '/paper', fileName + '.tex'], {timeout: 20000}, function(err, stdout, stderr) {
        if (stdout) {
            console.log('pdflatex stdout: ' + stdout);
        }
        if (stderr) {
            console.log('pdflatexSTDERR: ' + stderr);
        }
        if (err) {
            console.log('Error: ' + err);
            callback(err);
        } else {
            callback(null, fileName + '.pdf');
        }
    });
}
TexConverter.prototype.toBib = function( fileName, callback ){
    execFile('bibtex', [fileName],{cwd: process.cwd() + '/paper'}, function(err, stdout, stderr) {
        if (stdout) {

        }
        if (stderr) {
            console.log('bibTexSTDERR: ' + stderr);
        }
        if (err) {
            console.log('Error: ' + err);
            callback(err);
        } else {
            callback(null, fileName);
        }
    });
}
TexConverter.prototype.toPng = function( fileName, callback ){

    fs.readdir('./paper', function(err, files) {
        if (err) {
            console.log(err);   // TODO: Callback with error
        } else {
            for (var i = files.length - 1; i >= 0; i--) {
                if (files[i].lastIndexOf('.png') !== -1) {
                    fs.unlinkSync(process.cwd() + '/paper/' + files[i]);
                }
            }
        }
        console.log('PNG files cleaned up!');
    
        var fileStr = fileName.substr(0, fileName.indexOf('.'))

        var inputStr =  fileStr + '.pdf';
        var outputStr = fileStr + '-%d.png';

        execFile("gs", ["-dNOPAUSE","-dBATCH", "-r125","-sDEVICE=pngalpha","-sOutputFile=" + outputStr, inputStr], {cwd: process.cwd() + '/paper', timeout: 10000}, function (err, stdout, stderr) {

            if(stdout){

            }
            if(stderr){
                console.log("execFileSTDERR3:", JSON.stringify(stderr));
            }

            fs.readdir( "./paper", function(err, files){

                if(err){
                    console.log(err)
                }else{
                    var imageFiles = new Array();
                    var imgLen = 0;

                    for( var i = 0; i < files.length; ++i ){
                        if(files[i].indexOf("paper-") !== -1 ){
                            if(imageFiles.length > 0){
                                imgLen += 1;
                                imageFiles[ imgLen ] = files[ i ];
                            }else{
                                imageFiles[ imgLen ] = files[ i ];
                            }
                        }
                    }
                    var exitsCount = 0;
                    var notifyExit = function(filesCount) {
                        exitsCount = exitsCount + 1;
                        if (exitsCount === filesCount) {
                            var resultFiles = [];
                            for( var i = 0; i < imageFiles.length; ++i ){
                                resultFiles[ i ] = 'paper-' + (i+1) + '.png';
                            }
                            callback(null, resultFiles);
                        }
                    };

                    for( var i = 0; i < imageFiles.length; ++i ){
                        var currentFile = imageFiles[i];
                        var resultFile = 'paper-' + i + '.png'
                        execFile("composite", ["-quality", "100", currentFile, "../rpapr_img.png", resultFile], {cwd: process.cwd() + '/paper', timeout: 5000}, function(err, stdout, stderr){
                            if(stdout){
                            }
                            if(stderr){
                                console.log("execFileSTDERR3:", JSON.stringify(stderr));
                            }
                            notifyExit(imageFiles.length);
                        });

                    }
                }
            });
        });
    });
}

TexConverter.prototype.toResponse = function( files ){
    
    var result = [];
    
    for( var i = 0; i < files.length; ++i ){
        var image = { "id" : i, "name" : files[ i ] };
        result.push(image);
    }
    
    return result;
}
module.exports = TexConverter;