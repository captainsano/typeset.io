//AnySectionTex.js

/* Create any kind of section in tex format. Can be Section, Subsection or a SubSubSection */

/* Dependency */
var processString = require('./ProcessString.js');
var stringProcessor = new processString();
var imagesTex = require('./ImagesTex.js');

function AnySectionTex( sectionObj ){
    this.id = sectionObj.id;
    this.title = stringProcessor.processSpecialCharacters(sectionObj.title);
    this.contents = stringProcessor.processSpecialCharacters(
                            stringProcessor.processSections(
                                stringProcessor.processHTML(sectionObj.contents)
                            )
                    );
    if(sectionObj.images !== undefined ){
        if(sectionObj.images.length !== 0){
            this.images = sectionObj.images;
        }
    }

    //this.contents = stringProcessor.replaceTag(this.contents,"b","\\textbf{","}");
    //this.contents = stringProcessor.replaceTag(this.contents,"i","\\textit{","}");


}

AnySectionTex.prototype.getTitle = function(){
    return this.title;
}

AnySectionTex.prototype.getContents = function(){
    result = this.contents + '\n';
    return result;
}

AnySectionTex.prototype.hasImages = function(){
    if( this.images  ){
        if( this.images.length !== 0 ){
            return true
        }
    }
    return false;
}
AnySectionTex.prototype.getImagesTex = function(){
    var img = new imagesTex(this.images);
    return img.buildImages();
}
module.exports = AnySectionTex;
    
