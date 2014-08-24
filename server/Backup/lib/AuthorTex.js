//AuthorTex.js

/* Creates Name Block and Affiliation block for the Author in tex formate */

/* Dependency */
var processString = require('./ProcessString.js');
var stringProcessor = new processString();

function AuthorTex( author ){

    this.name = stringProcessor.processSpecialCharacters(author.name);
    this.affiliation = stringProcessor.processSpecialCharacters(author.affiliation);
    this.email = stringProcessor.processSpecialCharacters(author.email);
    if( author.phone !== undefined ){
        this.phone = author.phone;
    }
    if( author.fax !== undefined ){
        this.fax = author.fax;
    }
}


/* Add Name Block */
AuthorTex.prototype.createNameBlock = function( ){
    var texName = this.name.replace (/,/g, "");
    var result = '\\IEEEauthorblockN{' + texName + '}\n';
    return result;
}

/* Add Affiliation Block */
AuthorTex.prototype.createAffiliationBlock = function( ){

    var result = '\\IEEEauthorblockA{\n';
    
    result += stringProcessor.processNewline(this.affiliation);
    result += '\\\\\n';
    result += this.email;
    result += '\\\\\n';

    if( this.phone ){
        result +=  'Telephone: ' + this.phone + '\\\\\n';
    }
    
    if( this.fax ){
        result += 'Fax: ' + this.fax +'\\\\\n';
    }
    result  += '}\n';
    
    return result;
}
    
module.exports = AuthorTex;     
