(function(angular) {

    var directives = angular.module('typeset.directives');

    directives.directive('ngDragstart', [
        '$parse',
        function($parse) {
            return {
                restrict: 'A',
                compile: function($element, attr) {
                    var fn = $parse(attr['ngDragstart']);
                    return function(scope, element, attr) {
                        element.on('dragstart', function(event) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    };
                }
            };
        }
    ]);

    directives.directive('ngDragover', [
        '$parse',
        function($parse) {
            return {
                restrict: 'A',
                compile: function($element, attr) {
                    var fn = $parse(attr['ngDragover']);
                    return function(scope, element, attr) {
                        element.on('dragover', function(event) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    };
                }
            };
        }
    ]);

    directives.directive('ngDrop', [
        '$parse',
        function($parse) {
            return {
                restrict: 'A',
                compile: function($element, attr) {
                    var fn = $parse(attr['ngDrop']);
                    return function(scope, element, attr) {
                        element.on('drop', function(event) {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        });
                    };
                }
            };
        }
    ]);

}(angular));