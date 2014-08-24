(function(angular) {

    // Service to return the base64 URL of the file. Returns a promise.
    angular
        .module('typeset.services')
        .factory('FileReader', [
            '$q',
            function($q) {
                // Expects an input from the File API
                var toBase64 = function(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();

                    reader.onload = function(e) {
                        var base64 = reader.result;
                        deferred.resolve(base64);
                    };

                    reader.readAsDataURL(file);

                    return deferred.promise;
                };

                return {
                    toBase64: toBase64
                };
            }
        ])

}(angular));