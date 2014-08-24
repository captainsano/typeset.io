/**
 * Rich Text Area Targets: (Scribe Project)
 * - Keeping the text inside the contenteditable div semantic.
 * - Keeping track of the cursors.
 * - Injecting Candies
 * - TODO: Lists
 * - TODO: Nested Lists
 */

(function(angular, Selection, _) {
    var formatters = [], format;

    // Formatter to wrap inline nodes in the container
    formatters.push(function wrapInlineNodes(html) {
        var container = document.createElement('div');
        container.innerHTML = html;

        var currentBlockWrapper = null;

        // Walk through the siblings to identify any text or inline node and wrap it
        // all together in a div element. (Scribe)
        for (var i = 0; i < container.childNodes.length; i++) {
            var node = container.childNodes[i];

            if (node.nodeName === '#text' ||
                node.nodeName === 'B' ||
                node.nodeName === 'I' ||
                node.nodeName === 'SPAN' ||
                node.nodeName === 'EM') {
                currentBlockWrapper = document.createElement('div');
                container.insertBefore(currentBlockWrapper, node);
                // From this point on, the current node is a (i + 1)
                while (node.nodeName === '#text' || node.nodeName === 'B' || node.nodeName === 'I' || node.nodeName === 'SPAN' || node.nodeName === 'EM') {
                    currentBlockWrapper.appendChild(node);
                    node = currentBlockWrapper.nextSibling;
                    if (!node) {
                        break;
                    }
                }
                i = 0;  /// Start traversing from the first again
                currentBlockWrapper = null;
            }
        }
        return container.innerHTML;
    });

    // Formatter for normalizing the text
    formatters.push(function domNormalizer(html) {
        var container = document.createElement('div');
        container.innerHTML = html;
        container.normalize();  // works only on chrome!
        return container.innerHTML;
    });

    // Formatter for removing the markers
    formatters.push(function markerRemover(html) {
        html = html.replace(/[<]em[^>]*[>][<][/]em[>]/gi, '');
        return html;
    });

    // Formatter for removing the stray br and div tags
    formatters.push(function whitespaceRemover(html) {
        html = html.replace(/[<]br[>]/gi, '');
        html = html.replace(/[<]br[/][>]/gi, '');
        html = html.replace(/[<]div[>][<][/]div[>]/gi, '');
        return html;
    });

    // Run the HTML through all the formatters
    format = function(html) {
        for (var i = 0; i < formatters.length; i++) {
            html = formatters[i](html);
        }
        return html;
    };

    /// TODO: Formatter for stripping unnecessary <br> (trim() for HTML)

    angular
        .module('typeset.directives')
        .directive('richTextarea', [
            '$compile',
            function($compile) {
                return {
                    restrict: 'E',
                    templateUrl: 'templates/directives/rich_textarea.tpl.html',
                    require: ['ngModel', '^textareaContainer'],
                    controller: [
                        '$scope', 'BibliographyService',
                        function($scope, BibliographyService) {
                            $scope.isBlank = false;
                            $scope.getShortName = function(id) {
                                var shortName = BibliographyService.getShortNameForItem(id);
                                if (!shortName) {
                                    return '!CHECK!';
                                }
                                return shortName;
                            };
                        }
                    ],
                    compile: function(element, attributes) {
                        if (attributes.placeholder) {
                            element.children('.placeholder').text(attributes.placeholder);
                        }

                        return function(scope, element, attributes, controllers) {
                            var ngModelController = controllers[0],
                                textareaContainerController = controllers[1],
                                textarea = element.children('.textarea'),
                                currentSelection = null;

                            // Set the normalized value to the ngModel
                            textarea.on('input', function() {
                                updateModel(format(textarea.html()));
                            });

                            // Set the textarea's innerHTML to normalized value when it loses focus
                            textarea.on('blur', function() {
                                var innerHTML = format(textarea.html());
                                updateModel(innerHTML);
                            });

                            // Calling the Toolbar APIs
                            textarea.on('focus', function() {
                                textareaContainerController.focussed();
                            });

                            textarea.on('blur', function() {
                                textareaContainerController.blurred();

                                /// TODO: Set the formatted HTML in the textarea
                                /// and reset the cursor.
                            });

                            textarea.on('keyup mouseup', function() {
                                if (currentSelection) {
                                    currentSelection.removeMarkers();
                                }
                                currentSelection = new Selection();
                                currentSelection.placeMarkers();
                            });

                            // Expose APIs to the Textarea Container
                            scope.richTextAPI.execCommand = function(commandName, value) {
                                switch(commandName) {
                                    case 'bold':
                                    case 'italic': {
                                        document.execCommand(commandName, false, value || null);
                                        break;
                                    }
                                    case 'insertHTML': {
                                        // Ignore command if no current selection
                                        if (currentSelection) {
                                            var templateToInsert = angular.element(value);
                                            var startMarker = currentSelection.getMarkers()[0];

                                            // Insert spaces after and before
                                            startMarker.parentNode.insertBefore(document.createTextNode(' '), startMarker);
                                            startMarker.parentNode.insertBefore(templateToInsert.get(0), startMarker);
                                            startMarker.parentNode.insertBefore(document.createTextNode(' '), startMarker);

                                            $compile(templateToInsert)(scope);  // Link the Template with the current scope
                                        }
                                    }
                                }

                                // console.log('Executed ' + commandName + ' with value ' + value);

                                // Wrapped in setTimeout so as to avoid $digest() cycle
                                setTimeout(function() {
                                    textarea.focus();
                                    textarea.trigger('input');  // Trigger the input event
                                    /// TODO: Restore the range
                                    if (currentSelection) {
                                        currentSelection.selectMarkers();
                                    }
                                }, 0);
                            };

                            // Model -> View (Render Cycle)
                            ngModelController.$render = function() {
                                textarea.html(format(ngModelController.$viewValue) || '<div></div>');

                                var trimmed = _.string.trim(ngModelController.$viewValue);
                                if (trimmed.length === 0 || trimmed === '<div></div>') {
                                    scope.isBlank = true;
                                } else {
                                    scope.isBlank = false;
                                }

                                $compile(textarea)(scope);  // Link the rendered textarea with current scope
                            };

                            // View -> Model (Update Cycle)
                            var updateModel = function(data) {
                                ngModelController.$setViewValue(data);

                                scope.$apply(function() {
                                    var trimmed = _.string.trim(ngModelController.$viewValue);
                                    if (trimmed.length === 0 || trimmed === '<div></div>') {
                                        scope.isBlank = true;
                                    } else {
                                        scope.isBlank = false;
                                    }
                                });
                            };

                            // Watcher for avoiding <br> on blank
                            scope.$watch('isBlank', function() {
                                if (scope.isBlank) {
                                    // console.log('isBlank!');
                                    textarea.html('<div></div>');
                                }
                            });
                        }
                    }
                };
            }
        ]);

}(angular, window.rpapr_api.Selection, _));