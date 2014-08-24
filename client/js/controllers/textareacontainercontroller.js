(function(angular, document) {

    angular
        .module('typeset.controllers')
        .controller('TextareaContainerController', [
            '$scope', 'ActionSheetService',
            function($scope, ActionSheetService) {
                var CURRENT_MOUSE_DOWN_KEY = null,  // Set when executing a mouse down function
                    addCitation_injectionCallback,
                    addCitation_cancelCallback;
                $scope.textareaFocussed = false;
                $scope.actionButtonsHovered = false;
                $scope.richTextAPI = {};


                /*------- APIs that are exposed to the richtextarea directive -------*/
                this.blurred = function() {
                    $scope.$apply(function() {
                        $scope.textareaFocussed = false;
                    });
                };

                this.focussed = function() {
                    $scope.$apply(function() {
                        $scope.textareaFocussed = true;
                    });
                };

                // Adding Citation
                // -> Provide a callback for injecting the candy [InjectionCallback]
                // -> Provide a callback for cancel action  [CancelCallback]
                addCitation_injectionCallback = function(id) {
                    // console.log('Inserting Citation ' + id);
                    $scope.execCommand(
                        'insertHTML',
                        ('<span class="candy reference" data-type="citation" contenteditable="false">&nbsp;[{{getShortName(\'%ID%\')}}]&nbsp;</span>').replace(/\%ID\%/g, id)
                    );
                };

                addCitation_cancelCallback = function(id) {
                    // console.log('Citation Sheet Cancelled');
                };


                /*----------------- APIs for event handling ---------------*/
                $scope.addCitation = function() {
                    if ($scope.textareaFocussed) {
                        ActionSheetService.showSheet(
                            'citation',
                            {
                                editing: false,
                                injectionCallback: addCitation_injectionCallback,
                                cancelCallback: addCitation_cancelCallback
                            }
                        );
                    }
                };

                $scope.editCitation = function(id) {
                    // TOOD: Bring up the editing action sheet
                };

                $scope.clearMouseDown = function() {
                    CURRENT_MOUSE_DOWN_KEY = null;
                };

                // Wrapper for bold command
                $scope.execBold = function() {
                    if (CURRENT_MOUSE_DOWN_KEY !== 'EXEC_BOLD' && $scope.richTextAPI.execCommand && $scope.textareaFocussed) {
                        CURRENT_MOUSE_DOWN_KEY = 'EXEC_BOLD';
                        $scope.execCommand('bold');
                    }
                };

                $scope.execCommand = function(commandName, value) {
                    // console.log('Requesting to execute command... ' + commandName);
                    this.richTextAPI.execCommand(commandName, value);
                };

                /*---------- Images DragDrop API W3C ----------*/
                $scope.dragStart = function($event) {
                    $event.preventDefault();
                };

                $scope.dragOver = function($event) {
                    $event.preventDefault();
                };

                $scope.drop = function($event, section) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    // Grab the file and open the image insert action sheet
                    // if the dropped file is an image
                    var files = $event.originalEvent.dataTransfer.files;
                    if (files.length > 0) {
                        ActionSheetService.showSheet('image_upload', {
                            image: files[0],
                            container: section
                        });
                    }
                };

                // Image Editing
                $scope.editImage = function(container, imageIdx) {
                    ActionSheetService.showSheet('image_upload', {
                        editing: true,
                        container: container,
                        imageIdx: imageIdx
                    });
                };

                $scope.removeImage = function(container, imageIdx) {
                    if (imageIdx >= 0 && imageIdx < container.images.length) {
                        container.images.splice(imageIdx, 1);
                    }
                };
            }
        ]);

}(angular, document));