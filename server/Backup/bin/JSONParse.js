//JSONParse.js

/* Receives a JSON and parses it into a latex writeable string */

var textToTexRenderer = require('./TextToTexRenderer.js');  //dependency
var bibtex = require('../lib/Bibtex.js');

var fs = require('fs');

function JSONParse( jsonObj ){
    this.jsonObj = jsonObj;
}

JSONParse.prototype.toTex = function( ){
    var tex = '';
    var renderer = new textToTexRenderer();
    
    tex += renderer.addTextToTex( 'documentclass[' + renderer.addMeta(this.jsonObj.meta) + ']{IEEEtran}' );
    tex += renderer.addTextToTex( 'usepackage{graphicx}');                  // For last page column balancing
    tex += renderer.addTextToTex( 'usepackage{flushend}');                  // For last page column balancing
    tex += renderer.addTextToTex( 'begin{document}' );
    tex += renderer.addTitleToTex( this.jsonObj.contents.title );
    tex += renderer.addAuthorsToTex( this.jsonObj.contents.authors );
    tex += renderer.addAbstractAndKeywordsToTex(this.jsonObj.contents.abstract, this.jsonObj.contents.keywords);
    
    for( var i = 0; i < this.jsonObj.contents.sections.length; ++i ){
        tex += renderer.addSectionsToTex( this.jsonObj.contents.sections[ i ]);
    }

    tex += renderer.addTextToTex('bibliographystyle{IEEEtran}');
    tex += renderer.addTextToTex('nocite{*}');
    tex += renderer.addTextToTex('bibliography{bibFile}');
    tex += renderer.addTextToTex( 'end{document}' );

    return tex;
}   

JSONParse.prototype.toBib = function( ){
    var bib = "";
    var bibRenderer = new bibtex( this.jsonObj.bibliography );
    return bibRenderer.createBib();
}
/* Writes the received string onto file pointed by fileName and saves it with .tex */

JSONParse.prototype.writeToFile = function( string, fileName, path, callback ){
    var extension = '';
    if( fileName == "paper" ){
        extension = '.tex';
    } else {
        extension = '.bib' ;
        if (string.length === 0) {
            callback(fileName, true);
        }
    }
    fs.writeFile( path + '/' + fileName + extension, string, function(err) {
        if (err) {
            callback(null);   
        } else {
            callback(fileName);
        }
    });
}

module.exports = JSONParse;