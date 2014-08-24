(function(angular) {

    angular
        .module('typeset.services')
        .factory('UUIDFactory', [
            function() {
                var generateUUID, generateShortUUID;

                // https://www.ietf.org/rfc/rfc4122.txt - some stackoverflow question
                generateUUID = function() {
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (d + Math.random()*16)%16 | 0;
                        d = Math.floor(d/16);
                        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
                    });
                    return uuid;
                };

                // My own hack for shorter strings!   
                generateShortUUID = function() {
                    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).substr(-4)
                };

                return {
                    generateUUID: generateUUID,
                    generateShortUUID: generateShortUUID
                };
            }
        ]);

}(angular));