(function(angular) {

    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
                ActionSheetService.registerSheet(
                    'text_prompt',
                    'templates/actionsheets/text_prompt.tpl.html'
                );
            }
        ])

    angular
        .module('typeset.controllers')
        .controller('TextPromptActionSheetController', [
            '$scope', 'ActionSheetService',
            function($scope, ActionSheetService) {
                $scope.error = '';
                $scope.prompt = 'Enter a Value';
                $scope.data = '';
                $scope.placeholder = '';
                $scope.submitButtonTitle = 'Submit';

                if ($scope.sheetData) {
                    //---- Import Data from sheet ----
                    if ($scope.sheetData.hasOwnProperty('prompt')) {
                        $scope.prompt = $scope.sheetData.prompt;
                    }

                    if ($scope.sheetData.hasOwnProperty('submitButtonTitle')) {
                        $scope.submitButtonTitle = $scope.sheetData.submitButtonTitle;
                    }

                    if ($scope.sheetData.hasOwnProperty('data')) {
                        $scope.data = $scope.sheetData.data;
                    }

                    if ($scope.sheetData.hasOwnProperty('placeholder')) {
                        $scope.placeholder = $scope.sheetData.placeholder;
                    }
                }

                $scope.cancel = function() {
                    ActionSheetService.hideSheet('text_prompt');
                };

                $scope.submit = function() {
                    if ($scope.sheetData.hasOwnProperty('validationCallback')) {
                        $scope.error = $scope.sheetData.validationCallback($scope.data);

                        if ($scope.error && $scope.error.length > 0) {
                            return;
                        }
                    }

                    ActionSheetService.hideSheet('text_prompt');

                    if ($scope.sheetData.hasOwnProperty('submitCallback')) {
                        $scope.sheetData.submitCallback($scope.data);
                    }
                };
            }
        ]);

}(angular));