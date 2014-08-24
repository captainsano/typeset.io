(function(angular) {
    var registeredSheets = {}, // Key-value store, where key is sheetname & value is template url
        sheets = {
            visibleSheets: [] // Each sheet contains templateURL + data
        };

    angular
        .module('typeset.services')
        .factory('ActionSheetService', [
            function() {
                var registerSheet, unRegisterSheet, showSheet, hideSheet;

                registerSheet = function(sheetName, templateUrl) {
                    registeredSheets[sheetName] = templateUrl;
                };
    
                unRegisterSheet = function(sheetName) {
                    if (registeredSheets.hasOwnProperty(sheetName)) {
                        delete registeredSheets[sheetName];
                    }
                };

                showSheet = function(sheetName, data) {
                    if (registeredSheets.hasOwnProperty(sheetName)) {
                        sheets.visibleSheets.push({
                            templateURL: registeredSheets[sheetName],
                            data: (data)?(data):({})
                        });
                    }
                };

                hideSheet = function(sheetName) {
                    if (registeredSheets.hasOwnProperty(sheetName)) {
                        var sheetIdx = (function(templateURL) {
                            for (var i = sheets.visibleSheets.length - 1; i >= 0; i--) {
                                if (sheets.visibleSheets[i].templateURL == templateURL) {
                                    return i;
                                }
                            }

                            return -1;
                        }(registeredSheets[sheetName]));

                        if (sheetIdx >= 0) {
                            sheets.visibleSheets.splice(sheetIdx, 1);
                        }
                    }
                };

                return {
                    sheets: sheets.visibleSheets,
                    registerSheet: registerSheet,
                    unRegisterSheet: unRegisterSheet,
                    showSheet: showSheet,
                    hideSheet: hideSheet
                };
            }
        ]);

}(angular));