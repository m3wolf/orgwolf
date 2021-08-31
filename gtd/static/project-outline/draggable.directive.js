"use strict";

import "angular";
import 'jquery-ui-dist/jquery-ui';

angular.module('orgwolf.projectOutline')
    .directive('owDraggable', owDraggable);


function owDraggable() {
    /*************************************************
     * Directive that a heading drag-n-drop draggable
     * (uses jQuery ui)
     **************************************************/
    function link(scope, element, attrs) {
	var options, dragDropData;
	dragDropData = {};
	options = {
	    handle: '> .ow-hoverable',
	    // containment: '.outline',
	    zIndex: 9999,
	    helper: 'clone',
	    revert: 'invalid',
	    start: function(event, ui) {
		// Save some context data about the draggable
		dragDropData.list = scope.children;
		dragDropData.heading = scope.heading;
		$(element).data('dragDrop', dragDropData);
	    },
	};
	jQuery(element).draggable(options);
    }
    return {
	link: link,
	scope: false,
    };
}
