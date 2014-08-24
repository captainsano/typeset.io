(function(angular, _) {

    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
               ActionSheetService.registerSheet(
                    'compose_preferences',
                    'templates/actionsheets/compose_preferences.tpl.html'
               );
            }
        ]);

    angular
        .module('typeset.controllers')
        .controller('ComposePreferencesController', [
            '$scope', 'ActionSheetService', 'ComposePreferencesFactory',
            function($scope, ActionSheetService, ComposePreferencesFactory) {
                $scope.composePreferences = _.clone(ComposePreferencesFactory.composePreferences);

                $scope.cancel = function() {
                    ActionSheetService.hideSheet('compose_preferences');
                };
                
                $scope.submit = function() {
                    ComposePreferencesFactory.composePreferences.textSize = $scope.composePreferences.textSize;
                    ComposePreferencesFactory.composePreferences.draftMode = $scope.composePreferences.draftMode;
                    ComposePreferencesFactory.composePreferences.documentMode = $scope.composePreferences.documentMode;
                    ComposePreferencesFactory.composePreferences.specialMode = $scope.composePreferences.specialMode;
                    ComposePreferencesFactory.composePreferences.paperSize = $scope.composePreferences.paperSize;
                    ComposePreferencesFactory.composePreferences.sides = $scope.composePreferences.sides;
                    ComposePreferencesFactory.composePreferences.columns = $scope.composePreferences.columns;
                    ComposePreferencesFactory.composePreferences.appendicesNumbering = $scope.composePreferences.appendicesNumbering;
                    ComposePreferencesFactory.composePreferences.captions = $scope.composePreferences.captions;

                    ActionSheetService.hideSheet('compose_preferences');
                };
            }
        ]);

}(angular, _));