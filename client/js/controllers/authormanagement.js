(function(angular, _) {

    var authorObjectTemplate = {
        name: '',
        affiliation: '',
        email: '',
        phone: '',
        biography: '',
        thanks: ''
    }, errorObjectTemplate = {
        name: ''
    };

    // Register Action Sheet
    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
                ActionSheetService.registerSheet(
                    'author_management',
                    'templates/actionsheets/author_management.tpl.html'
                );
            }
        ]);

    angular
        .module('typeset.controllers')
        .controller('AuthorManagementController', [
            '$scope', 'PaperFactory', 'ActionSheetService',
            function($scope, PaperFactory, ActionSheetService) {
                if ($scope.sheetData.editing) {
                    $scope.author = _.clone($scope.sheetData.author);
                } else {
                    $scope.author = _.clone(authorObjectTemplate);
                }

                $scope.error = _.clone(errorObjectTemplate);

                $scope.cancel = function() {
                    $scope.error = _.clone(errorObjectTemplate);   // Suppress Errors

                    ActionSheetService.hideSheet('author_management');
                };

                $scope.reset = function() {
                    $scope.error = _.clone(errorObjectTemplate);   // Reset error object
                    $scope.author = _.clone(authorObjectTemplate); // Reset authors
                };

                $scope.submit = function() {
                    $scope.error = _.clone(errorObjectTemplate);   // Suppress Errors

                    if (_.string.trim($scope.author.name).length === 0) {
                        $scope.error.name = 'Name should not be blank.';
                        return;
                    }

                    if ($scope.sheetData.editing === false) {
                        PaperFactory.addAuthor($scope.author);
                    } else {
                        $scope.sheetData.author.name = $scope.author.name;
                        $scope.sheetData.author.affiliation = $scope.author.affiliation;
                        $scope.sheetData.author.email = $scope.author.email;
                        $scope.sheetData.author.phone = $scope.author.phone;
                        $scope.sheetData.author.biography = $scope.author.biography;
                        $scope.sheetData.author.thanks = $scope.author.thanks;
                    }

                    ActionSheetService.hideSheet('author_management');
                };
            }
        ]);

}(angular, _));