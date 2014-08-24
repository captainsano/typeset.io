(function(angular) {

    angular
        .module('typeset.services')
        .factory('ComposePreferencesFactory', [
            function() {
                var composePreferences = {
                    textSize: 'auto',
                    draftMode: 'final',
                    documentMode: 'conference',
                    specialMode: 'none',
                    paperSize: 'auto',
                    sides: 'one',
                    columns: 0,  // Auto
                    appendicesNumbering: 'auto',
                    captions: true
                };

                return {
                    composePreferences: composePreferences
                };
            }
        ]);

}(angular));