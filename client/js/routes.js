(function(angular) {

    angular
        .module('typeset')
        .config([
            '$routeProvider',
            function($routeProvider) {
                $routeProvider.
                    when('/editor', {
                        templateUrl: 'views/editor.view.html',
                        controller: 'EditorController'
                    }).
                    when('/compose', {
                        templateUrl: 'views/compose.view.html',
                        controller: 'ComposeViewController'
                    }).
                    otherwise({
                        redirectTo: '/editor'
                    });
            }
        ]);

}(angular));
