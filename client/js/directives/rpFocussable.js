(function(angular) {

    angular
        .module('typeset.directives')
        .directive('rpFocussable', [
            '$timeout',
            function($timeout) {
                return {
                    restrict: 'C',
                    link: function(scope, element) {
                        element
                            .on('focus', function() {
                                element.closest('.rp-focussable-container').addClass('rp-focussed');
                            })
                            .on('blur', function() {
                                element.closest('.rp-focussable-container').removeClass('rp-focussed');
                            });
                    }
                }
            }
        ]);

}(angular));