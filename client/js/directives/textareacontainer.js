(function(angular) {

    angular
        .module('typeset.directives')
        .directive('textareaContainer', [
            function() {
                return {
                    restrict: 'C',
                    controller: 'TextareaContainerController'
                };
            }
        ]);

}(angular));