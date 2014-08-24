(function(angular) {

    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
                ActionSheetService.registerSheet(
                    'compose_progress',
                    'templates/actionsheets/compose_progress.tpl.html'
                );
            }
        ]);

    angular
        .module('typeset.controllers')
        .controller('ComposeProgressController', [
            '$scope', '$location', 'ComposeService', 'ActionSheetService',
            function($scope, $location, ComposeService, ActionSheetService) {

                // Change path to compose on instantiation
                $location.path('/compose');

                $scope.cancel = function() {
                    ComposeService.cancel();
                    $location.path('/editor');
                    ActionSheetService.hideSheet('compose_progress');
                };
            }
        ]);

}(angular));