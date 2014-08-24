//Bibtex.js

//Creates .bib contents from the bibliography field.

function Bibtex( bibliographies ){
    this.bibliographies = bibliographies;
}

Bibtex.prototype.createStyle = function( bibliography ){
    return "@" + bibliography.type;
}

Bibtex.prototype.createCitation = function( bibliography ){
    return "{"+bibliography.id+","+"\n";
}

Bibtex.prototype.createAuthors = function( bibliography ){
    var result = '';
    if( bibliography.authors !== undefined ){
        result += "author = {";
        result += bibliography.authors.join(' and ');
        result += "},\n";
    }
    return result;
}

Bibtex.prototype.createTitle = function( bibliography ){
    var result = "title = {";
    if( bibliography.title ){
        result += bibliography.title;
        result += "},\n"
    }
    return result;
}

Bibtex.prototype.createOther = function( bibliography ){
    var result = "";
    for(var key in bibliography){
        var attrName = key;
        var attrValue = bibliography[key];
        if( attrName != "title" && attrName != "authors" && attrName != "id" && attrName != "type"){
            result += attrName + " = {" + attrValue + "},\n"
        }
    }
    result += "}\n";
    return result;
}

Bibtex.prototype.createBib = function(){
    var result = "";
    for( var i = 0; i < this.bibliographies.length; ++i ){
        result += this.createStyle(this.bibliographies[i]);
        result += this.createCitation(this.bibliographies[i]);
        result += this.createAuthors(this.bibliographies[i]);
        result += this.createTitle(this.bibliographies[i]);
        result += this.createOther(this.bibliographies[i]);
    }
    return result;
}

module.exports = Bibtex;