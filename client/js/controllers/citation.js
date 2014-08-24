(function(angular) {

    // Register the external reference action sheet
    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
                ActionSheetService.registerSheet(
                    'citation',
                    'templates/actionsheets/citation.tpl.html'
                );
            }
        ]);

    angular
        .module('typeset.controllers')
        .controller('CitationController', [
            '$scope', 'ActionSheetService', 'BibliographyService',
            function($scope, ActionSheetService, BibliographyService) {

                $scope.source_type = '';
                $scope.collection = BibliographyService.collection;
                $scope.selectedItem = null;

                $scope.addNewItem = function() {
                    // TODO: Brign up the add action sheet
                };

                $scope.selectItem = function(itemID) {
                    $scope.selectedItem = itemID;
                };
                
                $scope.cancel = function() {
                    if ($scope.sheetData && $scope.sheetData.cancelCallback) {
                        $scope.sheetData.cancelCallback();
                    }
                    ActionSheetService.hideSheet('citation');
                };

                $scope.submit = function() {
                    if ($scope.selectedItem) {
                        if ($scope.sheetData && $scope.sheetData.injectionCallback) {
                            $scope.sheetData.injectionCallback($scope.selectedItem);
                        }
                        ActionSheetService.hideSheet('citation');
                    }
                }

                $scope.edit = function(itemID, $event) {
                    // TODO: Bring up the edit action sheet
                };
            }
        ]);

}(angular));