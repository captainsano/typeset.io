(function(angular) {

    var dependencies = [
        'typeset.services',
        'typeset.controllers',
        'typeset.directives',
        'ngRoute',
        'ngAnimate',
        'restangular',
        'monospaced.elastic'
    ];

    angular.module('typeset', dependencies);

}(angular));