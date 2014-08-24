(function(angular) {

    // Controller to manage the entire editing view. Other scopes inherti from this.
    angular
        .module('typeset.controllers')
        .controller('EditorController', [
            '$scope', 'PaperFactory', 'ActionSheetService',
            function($scope, PaperFactory, ActionSheetService) {
                $scope.paper = PaperFactory.paper;

                $scope.addAuthor = function() {
                    ActionSheetService.showSheet(
                        'author_management',
                        {editing: false}    // We're adding a new author so editing is false
                    );
                };

                $scope.editAuthor = function(idx) {
                    if (idx < $scope.paper.authors.length && idx >= 0) {
                        ActionSheetService.showSheet(
                            'author_management',
                            {
                                editing: true,
                                author: $scope.paper.authors[idx]
                            }
                        );
                    }

                };

                $scope.removeAuthor = function(idx) {
                    PaperFactory.removeAuthor(idx);
                };

                $scope.addSection = function(sectionIdx) {
                    PaperFactory.addSection(sectionIdx);
                };

                $scope.removeSection = function(sectionIdx) {
                    PaperFactory.removeSection(sectionIdx);
                }

                $scope.addSubSection = function(sectionIdx, subSectionIdx) {
                    PaperFactory.addSubSection(sectionIdx, subSectionIdx);
                }

                $scope.removeSubSection = function(sectionIdx, subSectionIdx) {
                    PaperFactory.removeSubSection(sectionIdx, subSectionIdx);
                }

                $scope.addSubSubSection = function(sectionIdx, subSectionIdx, subSubSectionIdx) {
                    PaperFactory.addSubSubSection(sectionIdx, subSectionIdx, subSubSectionIdx);
                };

                $scope.removeSubSubSection = function(sectionIdx, subSectionIdx, subSubSectionIdx) {
                    PaperFactory.removeSubSubSection(sectionIdx, subSectionIdx, subSubSectionIdx);
                };
            }
        ]);

}(angular));