var _ = require('nimble');

module.exports = (function() {
  var renderBib;

  renderBib = function(bibItems) {
    var bib = '';
    _.each(bibItems, function(bibItem) {
      var fields = [];
      bib += '@' + bibItem.type + '{' + bibItem.id + ',\n';
      if (bibItem.authors) { fields.push('author = {' + bibItem.authors.join(' and ') + '}'); }
      if (bibItem.title) { fields.push('title = {' + bibItem.title + '}'); }
      if (bibItem.year) { fields.push('year = {' + bibItem.year + '}'); }
      if (bibItem.month) { fields.push('month = {' + bibItem.month + '}'); }
      if (bibItem.url) { fields.push('url = {' + bibItem.url + '}'); }
      if (bibItem.pages) { fields.push('pages = {' + bibItem.pages + '}'); }
      if (bibItem.number) { fields.push('number = {' + bibItem.number + '}'); }
      if (bibItem.series) { fields.push('series = {' + bibItem.series + '}'); }
      if (bibItem.organization) { fields.push('organization = {' + bibItem.organization + '}'); }
      if (bibItem.address) { fields.push('address = {' + bibItem.address + '}'); }
      if (bibItem.publisher) { fields.push('publisher = {' + bibItem.publisher + '}'); }
      if (bibItem.howpublished) { fields.push('howpublished = {' + bibItem.howpublished + '}'); }
      if (bibItem.booktitle) { fields.push('booktitle: {' + bibItem.booktitle + '}'); }

      for(var i = 0, len = fields.length; i < len; i++) {
        bib += fields[i];
        if (i < len - 1) {
          bib += ',';  
        }
        bib += '\n';
      }

      bib += '}\n'; // EO Bib         
    });
    return bib;
  };

  return {
    renderBib: renderBib
  };

}());