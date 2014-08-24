(function(angular, _) {

    angular
        .module('typeset.controllers')
        .controller('ComposeViewController', [
            '$scope', '$location', 'ComposeService', 'ActionSheetService',
            function($scope, $location, ComposeService, ActionSheetService) {
                var compose;

                $scope.data = [];
                $scope.baseURL = ComposeService.temp.composeURL;

                compose = function() {
                    $scope.data = [];

                    ComposeService.compose().then(function(data) {
                        // console.log('Compose Success');
                        $scope.data = data;

                        ActionSheetService.hideSheet('compose_progress');
                    }, function(data) {
                        // console.log('Compose Failed');
                        ActionSheetService.hideSheet('compose_progress');
                        $location.path('/editor');
                    });
                };

                // Listen for COMPOSE event on rootScope
                $scope.$on('COMPOSE', function() {
                    compose();
                });

                // Begin Compose as soon as the controller is instantiated
                compose();
            }
        ]);

}(angular, _));