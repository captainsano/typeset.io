(function(angular) {

    angular
        .module('typeset.controllers')
        .controller('HeaderButtonsController', [
            '$rootScope', '$scope', '$location', 'ActionSheetService', 'ComposeService',
            'PaperFactory', // Paper Factory for sample data
            function($rootScope, $scope, $location, ActionSheetService, ComposeService, PaperFactory) {
                $scope.currentLocation = $location.path();
                $scope.temp = ComposeService.temp;

                $scope.loadEditor = function() {
                    $location.path('/editor');
                }

                $scope.openComposePreferences = function() {
                    ActionSheetService.showSheet('compose_preferences');
                };

                $scope.compose = function() {
                    if ($location.path() === '/compose') {
                        $rootScope.$broadcast('COMPOSE');
                    }
                    ActionSheetService.showSheet('compose_progress');
                };

                $scope.loadSampleData = function() {
                    PaperFactory.loadSampleData();
                };

                /*--- Track the current location ---*/
                $scope.$on('$locationChangeSuccess', function() {
                    $scope.currentLocation = $location.path();
                });
            }
        ]);

}(angular));