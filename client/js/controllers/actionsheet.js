(function(angular) {

    angular
        .module('typeset.controllers')
        .controller('ActionSheetController', [
            '$scope', 'ActionSheetService',
            function($scope, ActionSheetService) {
                $scope.sheets = ActionSheetService.sheets;
            }
        ]);

}(angular));