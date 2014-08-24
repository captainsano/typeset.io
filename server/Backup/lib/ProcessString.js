// ProcessString.js

//Contains Functions to process user-defined string in a Tex format.

//Dependency
var sanitizeHtml = require('sanitize-html');

function ProcessString(){

}

/* Process Special Characters in String */
ProcessString.prototype.processSpecialCharacters = function( string ){

    var replacedString = string;

    //replacedString = replacedString.replace( /\\/g, "\\textbackslash ");
    replacedString = replacedString.replace( /\|/g, "\\textbar " );
    replacedString = replacedString.replace( /\>/g, "\\textgreater " );
    replacedString = replacedString.replace( /\-/g, "\\textendash " );
    replacedString = replacedString.replace( /\</g, "\\textless " );

    replacedString = replacedString.replace( /\%/g, "\\%" );
    replacedString = replacedString.replace( /\$/g, "\\$" );
    //replacedString = replacedString.replace( /\{/g, "\\{" );
    replacedString = replacedString.replace( /\_/g, "\\_" );
    replacedString = replacedString.replace( /\#/g, "\\#" );
    replacedString = replacedString.replace( /\&/g, "\\&" );
    //replacedString = replacedString.replace( /\}/g, "\\}" );

    return replacedString;
}

ProcessString.prototype.processNewline = function( string ){
    var replacedString = string.replace( /\n/g, "\\\\");
    return replacedString;
}

ProcessString.prototype.processSections = function( string ){

    var arrayOfDivs = this.sanitize( string ).split('</div>');
    var result = '';

    for( var i = 0; i < arrayOfDivs.length; ++i ){
        result += ( i == 0 )? "" : "\n\n";
        var body = arrayOfDivs[i];
        var sanitized = body.replace("<div>","");
        result += sanitized;
    }
    //result = this.replaceTag(result,"b","\\textbf{","}");
    //result = this.replaceTag(result,"i","\\textit{","}");
    result = result.replace(/&gt;/ig,">");
    result = result.replace(/&lt;/ig,"<");
    return result;
}

ProcessString.prototype.sanitize = function( string ){
    clean = sanitizeHtml(string, {
        allowedTags: [ 'div', 'b', 'i', 'em', 'strong', 'span' ],
        allowedAttributes : {
            'span' : [ 'data-id', 'class']
        }
    });
    return clean;
}

ProcessString.prototype.replaceTag = function( string, tag, startReplace, endReplace ){

    var startMatch = '[<]' + tag + '[>]';
    var endMatch = '[<]' + '[/]' + tag + '[>]';

    var reg = new RegExp( startMatch, 'g' );
    var result = string.replace( reg, startReplace);

    reg = new RegExp( endMatch, 'g' );
    result = result.replace( reg, endReplace );

    return result;
}

ProcessString.prototype.processHTML = function( string ){
    var result = string.replace(/<span\s(.*?)id=["]([a-zA-Z0-9]{4})["](.*)>(.*?)<\/span>/gi, "\\cite{$2}");
    return result;
}
ProcessString.prototype.replaceBackslash = function( string ){
    var match = '[\\]' + '[backslash\stextbf]';
    var reg = new Regexp( match, 'g' );
    return string.replace(reg, "\\textbf")
}
module.exports = ProcessString;