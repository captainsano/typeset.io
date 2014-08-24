var tu = require('./tex-util.js'),
    sanitizeHTML = require('sanitize-html'),
    DomJS = require('dom-js').DomJS,
    _ = require('nimble');

module.exports = (function() {

  var renderAuthorBlock,
      renderAbstractBlock,
      renderKeywords,
      renderSections;

  var renderSection,
      renderImages,
      htmlToTex;

  renderAuthorBlock = function(authors) {
    var tex = '';
    // Author Block
    if (authors && authors.length > 0) {
      tex += '\\author{%\n';
      for (var i = 0, len = authors.length; i < len; i++) {
        var a = authors[i];
        if (a.name) {
          tex += tu.command('IEEEauthorblockN', a.name);
        }
        tex += '\\IEEEauthorblockA{\n';
        if (a.affiliation) {
          tex += a.affiliation + tu.slashLineBreak + '\n';
        }
        if (a.email) {
          tex += a.email;
        }
        tex += '\n}\n'; // EO author aff.
        if (len > 1 && i < len - 1) {
          tex += '\\and\n';
        }
      }
      tex += '}\n'; // EO author
    }
    return tex;    
  };

  renderAbstractBlock = function(abstract) {
    var tex = '';
    tex += tu.command('begin', 'abstract');
    tex += tu.replaceSpecialChars(abstract) + '\n';
    tex += tu.command('end', 'abstract');
    return tex;
  };

  renderKeywords = function(keywords) {
    var tex = '';
    if (keywords && keywords.length > 0) {
      tex += tu.command('begin', 'IEEEkeywords');
      tex += keywords.join(', ') + '\n';
      tex += tu.command('end', 'IEEEkeywords');
    }
    return tex;
  };

  renderSections = function(sections) {
    var tex = '';
    
    _.each(sections, function(section) {
      tex += renderSection('section', section);
      tex += '\n';
      _.each(section.subsections, function(subsection) {
        tex += renderSection('subsection', subsection);
        tex += '\n';
        _.each(subsection.subsubsections, function(subsubsection) {
          tex += renderSection('subsubsection', subsubsection)
          tex += '\n';
        });
      });
    });
    
    return tex;
  };

  

  //---- Private Methods ----
  renderSection = function(level, section) {
    if (!section.title) {
      section.title = '[Untitled Section]';
    }
    var tex = '';
    tex += tu.command(level, tu.replaceSpecialChars(section.title));
    tex += '\n';
    tex += htmlToTex(section.contents);  // TODO: Handle Special Chars & Candies!    
    tex += '\n';
    tex += renderImages(section.images);
    tex += '\n';
    return tex;
  };

  renderImages = function(images) {
    var tex = '';
    _.each(images, function(image) {
      if (parseFloat(image.width) > 3.5) { tex += tu.command('begin', 'figure*'); }
      else { tex += tu.command('begin', 'figure'); }      
      tex += tu.command('centering');
      tex += tu.command('includegraphics', 'img/' + image.name, ['width=' + image.width]);
      tex += tu.command('caption', tu.replaceSpecialChars(image.caption));
      if (parseFloat(image.width) > 3.5) { tex += tu.command('end', 'figure*'); }
      else { tex += tu.command('end', 'figure'); }
      tex += '\n';
    });
    return tex;
  };

  htmlToTex = function(html) {
    var tex = '';
    html = sanitizeHTML(html, {
        allowedTags: [ 'div', 'b', 'i', 'em', 'strong', 'span' ],
        allowedAttributes : {
            'span' : [ 'data-id', 'class']
        }
    });

    var domjs = new DomJS();
    domjs.parse('<root>' + html + '</root>', function(err, root) {
      // Each child is a paragraph here
      _.each(root.children, function(paragraph) {
        var parTex = '';
        _.each(paragraph.children, function(node) {
          // Handle reference
          if (node.hasOwnProperty('name') && node['name'] === 'span') {
            if (node.attributes.hasOwnProperty('class') && node.attributes['class'].indexOf('reference') != -1) {
              parTex += tu.command('cite', node.attributes['data-id']);
            }
          } else if (node.hasOwnProperty('text')) {
            parTex += tu.replaceSpecialChars(node.text);
          }
        });
        tex += parTex + '\n\n'; // EO paragraph
      });
    });

    return tex;
  }

  return {
    renderAuthorBlock: renderAuthorBlock,
    renderAbstractBlock: renderAbstractBlock,
    renderKeywords: renderKeywords,
    renderSections: renderSections
  };
}());