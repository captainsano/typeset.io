(function(angular) {

    angular
        .module('typeset.controllers')
        .run([
            'ActionSheetService',
            function(ActionSheetService) {
                ActionSheetService.registerSheet(
                    'image_upload',
                    'templates/actionsheets/image_upload.tpl.html'
                );
            }
        ]);

    angular
        .module('typeset.controllers')
        .controller('ImageUploadController', [
            '$scope', 'ActionSheetService', 'FileReader', 'PaperFactory', 'UUIDFactory', 'ComposeService',
            function($scope, ActionSheetService, FileReader, PaperFactory, UUIDFactory, ComposeService) {
                $scope.error = {
                    caption: ''
                };
                $scope.imgURL = '';
                $scope.caption = '';
                $scope.imageWidthInInches = '';

                if ($scope.sheetData) {
                    if ($scope.sheetData.editing) {
                        $scope.caption = $scope.sheetData.container.images[$scope.sheetData.imageIdx].caption;
                        $scope.imgURL = $scope.sheetData.container.images[$scope.sheetData.imageIdx].data;
                    } else {
                        FileReader.toBase64($scope.sheetData.image).then(function(base64) {
                            $scope.imgURL = base64;

                            // Determine Width
                            var img = document.createElement('img');
                            img.src = base64;
                            // console.log(img.width);
                            $scope.imageWidthInInches = (img.width / 100);    // 100 pixels per inch

                            if ($scope.imageWidthInInches > 7.25) {
                                $scope.imageWidthInInches = 7.25;
                            }

                            $scope.imageWidthInInches = $scope.imageWidthInInches + 'in';    // 100 pixels per inch
                        });
                    }
                }

                /// TODO: Calculate the aspect ratio and specify width

                $scope.cancel = function() {
                    ActionSheetService.hideSheet('image_upload');
                };

                $scope.insert = function($event) {
                    $scope.error.caption = '';

                    if ($scope.caption.length === 0) {
                        $scope.error.caption = 'Enter a caption';
                        $event.preventDefault();
                        return false;
                    } else {
                        // Place the image in the section's data structure
                        $scope.sheetData.container.images.push({
                            id: UUIDFactory.generateShortUUID(),
                            name: $scope.sheetData.image.name,
                            caption: $scope.caption,
                            data: $scope.imgURL,
                            width: $scope.imageWidthInInches
                        });

                        var formData = new FormData();
                        formData.append($scope.sheetData.image.name, $scope.sheetData.image);

                        // now post a new XHR request
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', ComposeService.temp.composeURL + '/upload');
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                // console.log('all done: ' + xhr.status);
                            } else {
                                // console.log('Something went terribly wrong...');
                            }
                        };

                        xhr.send(formData);

                        ActionSheetService.hideSheet('image_upload');
                    }

                };

                $scope.done = function() {
                    $scope.error.caption = '';

                    if ($scope.caption.length === 0) {
                        $scope.error.caption = 'Enter a caption';
                        return false;
                    }

                    // Edit the image's data structure.
                    $scope.sheetData.container.images[$scope.sheetData.imageIdx].caption = $scope.caption;

                    ActionSheetService.hideSheet('image_upload');
                };
            }
        ]);

}(angular));