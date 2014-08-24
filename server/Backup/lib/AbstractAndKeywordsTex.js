//AbstractAndKeywordsTex.js

//Creates Tex version of Abstract and index terms.

/* Dependency */
var processString = require('./ProcessString.js');
var stringProcessor = new processString();

function AbstractAndKeywordsTex( abstractObj, keywordObj ){
    this.abstract = stringProcessor.processSpecialCharacters(abstractObj);
    if (keywordObj && keywordObj.length > 0) {
        this.keywords = stringProcessor.processSpecialCharacters(keywordObj.join());
    }
}

AbstractAndKeywordsTex.prototype.abstractToTex = function( ){
    var result = '';
    
    result += '\\begin{abstract}\n';
    result += this.abstract;
    result += '\n';
    result += '\\end{abstract}\n';
    
    return result;
}

AbstractAndKeywordsTex.prototype.keywordsToTex = function   ( ){
    var result = '';
    
    result += '\n\\begin{IEEEkeywords}\n';
    result += this.keywords;
    result += '\n';
    result += '\n\\end{IEEEkeywords}\n';
    
    return result;
}

module.exports = AbstractAndKeywordsTex;