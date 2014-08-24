//TextToTexRenderer.js

/* Recieves a text title and returns the tex version of the same. */

/* Dependency */
var processString = require('../lib/ProcessString.js');
var author = require('../lib/AuthorTex.js');
var abstractRef = require('../lib/AbstractAndKeywordsTex.js');
var anySection = require('../lib/AnySectionTex.js');

var stringProcessor = new processString();

function TextToTexRenderer( ){
}

TextToTexRenderer.prototype.addTitleToTex = function ( title ){
    var result = '\\title{' + stringProcessor.processNewline(stringProcessor.processSpecialCharacters(title)) + '}\n';
    return result;
}

/* Receive a proper Tex Command as Text and just append a new line and render it. */
TextToTexRenderer.prototype.addTextToTex = function ( text ){
    var result = '\\' + text + '\n';
    return result;
}

/* Loop through author list to create their tex string */
TextToTexRenderer.prototype.addAuthorsToTex = function( authors ){
    
    var result = '';
    
    result += '\\author{\n';
    for( var i = 0; i < authors.length; ++i ){
        result += this.addAuthorToTex( authors[ i ] );
        if( i != authors.length - 1 ){
            result += '\\and\n';
        }
    }
    
    result += '}' + '\n' + '\\maketitle' + '\n';
    return result;
}

/* Create tex strings for individual authors */
TextToTexRenderer.prototype.addAuthorToTex = function( authorObj ){
    
    var myAuthor = new author( authorObj );
    var result = '';
        
    result += myAuthor.createNameBlock();
    result += myAuthor.createAffiliationBlock();
    return result;
}

/* Create tex string for abstract and keywords */
TextToTexRenderer.prototype.addAbstractAndKeywordsToTex = function( abstract, keywords ){
    
    var result = '';
    var myAbstract = new abstractRef(abstract, keywords);
    
    result += myAbstract.abstractToTex();
    result += myAbstract.keywordsToTex();
    
    return result;
}

/* Create tex string for section, subsection and subsubsection */
TextToTexRenderer.prototype.addSectionsToTex = function( section ){
    
    var mySection = new anySection( section );
    var result = '';
    
    result += '\\section{' + mySection.getTitle() + '}\n';
    
    result += mySection.getContents();
    if( mySection.hasImages() ){
        result += mySection.getImagesTex();
    }
    if( section.subsections != undefined && section.subsections.length !== 0 ){
        for( var i = 0; i < section.subsections.length; ++i ){
            result += this.addsubsectionsToTex( section.subsections[ i ] );
        }
    }
    
    return result;
}

TextToTexRenderer.prototype.addsubsectionsToTex = function( subsection ){
    
    var mySection = new anySection( subsection );
    var result = '';
    
    result += '\\subsection{' + mySection.getTitle() + '}\n';
    result += mySection.getContents();
    if( mySection.hasImages() ){
        result += mySection.getImagesTex();
    }

    if( subsection.subsubsections != undefined && subsection.subsubsections.length !== 0 ){
        for( var i = 0; i < subsection.subsubsections.length; ++i ){
            result += this.addsubsubsectionsToTex( subsection.subsubsections[ i ] );
        }
    }
    
    return result;
}

TextToTexRenderer.prototype.addsubsubsectionsToTex = function( subsubsection ){

    var mySection = new anySection( subsubsection );
    var result = '';            
    
    result += '\\subsubsection{' + mySection.getTitle() + '}\n';
    result += mySection.getContents();
    if( mySection.hasImages() ){
        result += mySection.getImagesTex();
    }
    return result;
}

TextToTexRenderer.prototype.addMeta = function( meta ){
    var resultArray = [];
    if( meta.textSize !== "auto" ){
        resultArray.push(meta.textSize);
    }
    if (meta.draftMode !== 'final') {
        resultArray.push(meta.draftMode);
    }
    resultArray.push(meta.documentMode);
    if( meta.columns == "1" ){
        resultArray.push("onecolumn");
    }
    return resultArray.join(",");
}
module.exports = TextToTexRenderer;