/**
 *  DOM Selection API. Scribe: https://github.com/guardian/scribe
 */
(function(window) {

    var Selection = function() {
        this.selection = window.getSelection();

        if (this.selection.rangeCount) {
            this.range = this.selection.getRangeAt(0);
        }
    };

    Selection.prototype.placeMarkers = function() {
        // Insert a marker node
        var startMarker = document.createElement('em');
        startMarker.classList.add('marker');
        var endMarker = document.createElement('em');
        endMarker.classList.add('marker');

        // Add attribute to the markers making them contenteditable=false
        startMarker.setAttribute('contenteditable', 'false');
        endMarker.setAttribute('contenteditable', 'false');

        // End marker
        var rangeEnd = this.range.cloneRange(); /// TODO: Fix CloneRange Undefined bug
        rangeEnd.collapse(false);

        // console.log(rangeEnd.endContainer.parentNode.nodeName);

        // Remove placing the markers if the parent is a candy
        if (rangeEnd.endContainer.parentNode.nodeName === 'SPAN' && rangeEnd.endContainer.parentNode.classList.contains('candy')) {
            // Do not insert any marker
            // console.log('Did not place any marker');
        } else {
            rangeEnd.insertNode(endMarker);
        }


        // Remove the end marker's blank next sibling
        if (endMarker.nextSibling && endMarker.nextSibling.nodeType === 3 && endMarker.nextSibling.data === '') {
            endMarker.parentNode.removeChild(endMarker.nextSibling);
        }

        if (!this.range.collapsed) {
            // Start marker
            var rangeStart = this.range.cloneRange();
            rangeStart.collapse(true);
            rangeStart.insertNode(startMarker);

            // Remove the start marker's blank next sibling
            if (startMarker.nextSibling && startMarker.nextSibling.nodeType === 3 && startMarker.nextSibling.data === '') {
                startMarker.parentNode.removeChild(startMarker.nextSibling);
            }
        }

        this.selection.removeAllRanges();
        this.selection.addRange(this.range);
    };

    Selection.prototype.getMarkers = function () {
        return document.querySelectorAll('em.marker');
    };

    Selection.prototype.removeMarkers = function () {
        var markers = this.getMarkers();
        // console.log('Markers: ');
        // console.log(markers);
        for (var i = 0; i < markers.length; i++) {
            markers[i].parentNode.removeChild(markers[i]);
        }
    };

    Selection.prototype.selectMarkers = function (keepMarkers) {
        var markers = this.getMarkers();
        if (!markers.length) {
            return;
        }

        this.range.setStartBefore(markers[0]);
        if (markers.length >= 2) {
            this.range.setEndAfter(markers[1]);
        } else {
            // We always reset the end marker because otherwise it will just
            // use the current range’s end marker.
            this.range.setEndAfter(markers[0]);
        }

        if (!keepMarkers) {
            this.removeMarkers();
        }

        this.selection.removeAllRanges();
        this.selection.addRange(this.range);
    };

    if (!window.rpapr_api) {
        window.rpapr_api = {};
    }

    window.rpapr_api.Selection = Selection;
}(window));