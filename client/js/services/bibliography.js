(function(angular, _) {

    var formatForShortName = function(str, truncateIndex) {
        str = str.toLowerCase().replace(/[^a-z0-9]/gi, '');

        if (truncateIndex) {
            str = str.substring(0, truncateIndex);
        }

        return str;
    };

    angular
        .module('typeset.services')
        .factory('BibliographyService', [
            'UUIDFactory',
            function(UUIDFactory) {
                var collection, addItem, removeItem, getItem, getShortNameForItem;

                collection = [];

                addItem = function(item) {
                    if (!item.hasOwnProperty('id')) {
                        item.id = UUIDFactory.generateShortUUID();
                    }
                    collection.unshift(item);
                };
                
                getItem = function(id) {
                    var i
                    for (i = collection.length - 1; i >= 0; i--) {
                        if (collection[i].id === id) {
                            return collection[i];
                        }
                    }
                };

                getShortNameForItem = function(id) {
                    // Find the item in collection
                    var item = _.findWhere(collection, {id: id});

                    // Item was not found
                    if (!item) {
                        return null;
                    }

                    /* Check if item's shortname was already generated
                    it (item._shortName && item._shortName !== '') {
                        return item._shortName;
                    }
                    */

                    // Generate short name - Assumes validity of the items.
                    switch(item.type) {
                        case 'article':
                        case 'inproceedings':
                        case 'mastersthesis':
                        case 'phdthesis':
                        case 'techreport': {
                            var author = formatForShortName(item.authors[0], 5),
                                title = formatForShortName(item.title, 3),
                                year = item.year;

                            return (author + year + title);
                        }
                        case 'book': {
                            var author = formatForShortName((item.authors.length > 0)?item.authors[0]:item.editors[0], 5),
                                title = formatForShortName(item.title, 3),
                                year = item.year;

                            return (author + year + title);
                        }
                        case 'electronic':
                        case 'manual':
                        case 'periodical':
                        case 'standard': {
                            var title = formatForShortName(item.title, 10),
                                year = (item.year)?item.year:'';

                            return (title + year);
                        }
                        case 'patent': {
                            return item.number;
                        }
                        case 'unpublished': {
                            var author = formatForShortName(item.authors[0], 5),
                                year = (item.year)?item.year:'',
                                title = formatForShortName(item.title, 3);

                            return (author + year + title);
                        }
                    }

                    return null;
                };


                return {
                    collection: collection,
                    addItem: addItem,
                    removeItem: removeItem,
                    getItem: getItem,
                    getShortNameForItem: getShortNameForItem
                };
            }
        ]);

}(angular, _));