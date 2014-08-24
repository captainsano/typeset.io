//ImagesTex.js
//Creates tex images for sections in the json

function ImagesTex( imagesArray ){
    this.images = imagesArray;
}

ImagesTex.prototype.buildBegin = function( image ){
    result = "\\begin"
    result += parseFloat(image.width) > 3.5 ?
              "{figure*}" :
              "{figure}";
    result += "[tb]\n"

    return result;
}

ImagesTex.prototype.buildCentering = function(){
    return "\\centering\n";
}

ImagesTex.prototype.buildGraphics = function( image ){

    result = "\\includegraphics"
    result += "[width="+image.width+"]";
    result += "{paper/img/"+image.name+"}\n";

    return result;
}

ImagesTex.prototype.buildCaption = function( image ){
    return "\\caption" + "{" + image.caption + "}\n";
}

ImagesTex.prototype.buildLabel = function( image ){
    return "\\label"+"{"+image.id+"}\n";
}

ImagesTex.prototype.buildEnd = function( image ){
    result = "\\end";
    result += parseFloat( image.width) > 3.5 ?
              "{figure*}" :
              "{figure}\n\n";
    return result;
}

ImagesTex.prototype.buildImages = function(){
    result = "";
    for( var i = 0; i < this.images.length; ++i ){
        result += this.buildBegin(this.images[i]);
        result += this.buildCentering();
        result += this.buildGraphics(this.images[i]);
        result += this.buildCaption(this.images[i]);
        result += this.buildLabel(this.images[i]);
        result += this.buildEnd(this.images[i]);
    }
    console.log("Image Data: " + result);
    return result;
}

module.exports = ImagesTex;