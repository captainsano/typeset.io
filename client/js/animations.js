// Do this in the last 1-2 hours
(function(angular) {

    /*---- Action Sheet Animation ----*/
    angular
        .module('typeset')
        .animation('.action-sheet-container', function() {
            return {
                enter: function(element, done) {
                    // Set the first repeat child in right state
                    var background = element.children('.action-sheet-repeat-item').children('.background'),
                        pinner = element.children('.action-sheet-repeat-item').children('.action-sheet-pinner');

                        background.css({
                            opacity: 0.0
                        });

                        pinner.css({
                            top: '-' + pinner.children('.action-sheet').outerHeight() + 'px',
                            opacity: 0.0
                        });

                    element.
                        css({
                            opacity: 0.0
                        }).
                        animate({
                            opacity: 1.0
                        }, 250, function() {    // Animate the first child
                            background.animate({
                                opacity: 1.0
                            }, 250);

                            pinner.animate({
                                top: '0px',
                                opacity: 1.0
                            }, 250, done);
                        });
                },
                leave: function(element, done) {
                    // Set the first repeat child in right state
                    var background = element.children('.action-sheet-repeat-item').children('.background'),
                        pinner = element.children('.action-sheet-repeat-item').children('.action-sheet-pinner');

                    background.css({
                        opacity: 1.0
                    });

                    pinner.css({
                        top: '0px',
                        opacity: 1.0
                    });

                    background.animate({
                        opacity: 0.0
                    });

                    pinner.animate({
                        top: '-' + pinner.children('.action-sheet').outerHeight() + 'px',
                        opacity: 0.0
                    }, 250, function() {
                        element.
                            css({
                                opacity: 1.0
                            }).
                            animate({
                                opacity: 0.0
                            }, 250, done);
                    });
                }
            };
        });

    /*---- Action Sheet's Animation ----*/
    angular
        .module('typeset')
        .animation('.action-sheet-repeat-item', function() {
           return {
               enter: function(element, done) {
                   var background = element.children('.background'),
                       pinner = element.children('.action-sheet-pinner');

                   background.
                       css({
                           opacity: 0.0
                       }).
                       animate({
                           opacity: 1.0
                       }, 250);

                   pinner.
                       css({
                           top: '-' + pinner.children('.action-sheet').outerHeight() + 'px',
                           opacity: 0.0
                       }).
                       animate({
                           top: '0px',
                           opacity: 1.0
                       }, 250, done);
               },
               leave: function(element, done) {
                   var background = element.children('.background'),
                       pinner = element.children('.action-sheet-pinner');

                   background.
                       css({
                           opacity: 1.0
                       }).
                       animate({
                           opacity: 0.0
                       }, 250);

                   pinner.
                       css({
                           top: '0px',
                           opacity: 1.0
                       }).
                       animate({
                           top: '-' + pinner.children('.action-sheet').outerHeight() + 'px',
                           opacity: 0.0,
                       }, 250, done);
               }
           };
        });

    /*---- New Text Container Creation ----*/
    angular
        .module('typeset')
        .animation('.text-container-repeater', function() {
            return {
                enter: function(element, done) {
                    var titleField = element.find('input.title');

                    element.
                        css({
                            opacity: 0.0
                        }).
                        animate({
                            opacity: 1.0
                        }, 150, function() {
                            titleField.focus();

                            done();
                        });
                },
                leave: function(element, done) {
                    element.
                        css({
                            opacity: 0.0
                        }).
                        animate({
                            opacity: 1.0
                        }, 150, done);
                }
            };
        });

    /*----- Entering and Exiting the ngView ----*/
    angular
        .module('typeset')
        .animation('.container', function() {
            return {
                enter: function(element, done) {
                    element
                        .animate({
                            top: 0,
                            opacity: 1.0
                        }, 250, done);
                },
                leave: function(element, done) {
                    element
                        .animate({
                            top: '100%',
                            opacity: 0.0
                        }, 250, done);
                }
            }
        });

}(angular));