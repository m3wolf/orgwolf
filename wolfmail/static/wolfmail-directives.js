/*globals angular, $ */
"use strict";

window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');

angular.module('owDirectives')

/*************************************************
* Directive sets the parameters of next
* actions table row
**************************************************/
.directive('owMessageRow', function() {
    function link(scope, element, attrs) {
	var $element, $bTask, $bProject, $bComplete, $bDefer, $bArchive, $bDelete;
	$element = $(element);
	$element.find('span').tooltip();
	scope.headings = [];
	// Find buttons
	$bTask = $element.find('.inbox-list__action-button--new-task');
	$bProject = $element.find('.inbox-list__action-button--new-project');
	$bComplete = $element.find('.inbox-list__action-button--complete');
	$bDefer = $element.find('.inbox-list__action-button--defer');
	$bArchive = $element.find('.inbox-list__action-button--archive');
	$bDelete = $element.find('.inbox-list__action-button--delete');
	// Set button visibility for this row
	if (attrs.owHandler === 'plugins.deferred') {
	    // Deferred nodes
	    $bProject.remove();
	    $bArchive.remove();
	    $bDelete.remove();
	} else {
	    $bComplete.remove();
	}
	// Respond to new rows being added
	scope.$on('heading-created', function(e, message, newHeading) {
	    if ( scope.message.id === message.id ) {
		scope.headings.push(newHeading);
	    }
	});
    }
    return {
	scope: true,
	link: link,
    };
})

/*************************************************
* Directive for showing the Headings that are
* descended from a message.
*   eg. Message --> new task (Heading)
**************************************************/
.directive('owMessageHeading', ['todoStates', function(todoStates) {
    function link(scope, element, attrs) {
	scope.isEditable = false;
	scope.$on('finishEdit', function() {
	    scope.isEditable = false;
	});
	scope.$watch('heading.todo_state', function(newStateId) {
	    if ( newStateId) {
		scope.todoState = todoStates.filter(function(state) {
		    return state.id === newStateId;
		})[0];
	    } else {
		scope.todoState = null;
	    }
	});
    }
    return {
	scope: false,
	link: link,
    };
}])

/*************************************************
* Directive that handles actions on messages
*
**************************************************/
.directive('owMsgActions', ['Heading', 'dateFilter', 'toaster', function(Heading, dateFilter, toaster) {
    // Directive handles actions modal on message object
    function link(scope, element, attrs) {
	var $element, MessageApi;
	// Find jQuery elements
	$element = $(element);
	scope.$task_modal = $element.find('.modal.task');
	scope.task_modal = new bootstrap.Modal(scope.$task_modal);
	scope.$delete_modal = $element.find('.modal.delete');
	scope.delete_modal = new bootstrap.Modal(scope.$delete_modal);
	scope.$defer_modal = $element.find('.modal.defer');
	scope.defer_modal = new bootstrap.Modal(scope.$defer_modal);
	// Object tracks the new node that's being created
	if ( scope.new_node === undefined ) {
	    scope.new_node = {};
	}
	// Handlers for showing modals
	scope.create_task_modal = function(msg) {
	    // Abstract handler: shows modal for creating a new task
	    scope.new_node.title = msg.subject;
	    if ( msg.handler_path === 'plugins.deferred' ) {
		// Deferred nodes don't show the modal
		msg.$createNode();
	    } else {
		// Show a modal for creating a new Node
		scope.active_msg = msg;
		scope.modal_task = true;
		scope.task_modal.show()
	    }
	};
	scope.open_task_modal = function(msg) {
	    // Shows modal for creating a new NEXT task
	    scope.new_node.close = false;
	    scope.create_task_modal(msg);
	};
	scope.completeTask = function(msg) {
	    // Make the Node as completed in the API
	    msg.$createNode({close: true});
	};
	scope.create_project_modal = function(msg) {
	    // Shows modal for creating a new project (root Node)
	    delete scope.new_node.tree_id;
	    delete scope.new_node.parent;
	    scope.new_node.title = msg.subject;
	    scope.active_msg = msg;
	    scope.modal_task = false;
	    scope.task_modal.show();
	};
	scope.show_defer_modal = function(msg) {
	    // Show modal for rescheduling a Message for a future date
	    var today;
	    today = new Date().toISOString().split('T')[0];
	    scope.$defer_modal.find('#target-date').val(today);
	    scope.active_msg = msg;
	    scope.defer_modal.show();
	};
	scope.show_delete_modal = function(msg) {
	    scope.active_msg = msg;
	    scope.delete_modal.show();
	};
	// Handlers for commiting actions
	scope.archive = function(msg) {
	    msg.$archive();
	};
	scope.createNode = function(msg) {
	    // Send the new Node to the API
	    scope.task_modal.hide();
	    msg.$createNode(scope.new_node);
	};
	scope.change_project = function(project) {
	    // Get a list of descendants for the selected project(tree)
	    scope.parents = Heading.query({tree_id: project.tree_id,
					    archived: false});
	    scope.parent = project;
	};
	scope.change_parent = function(parent) {
	    // User picked a new project for the Node()
	    scope.new_node.parent = parent.id;
	};
	scope.deferMessage = function() {
	    scope.defer_modal.hide();
	    // Reschedule this message to appear in the future
	    scope.new_node.target_date = scope.$defer_modal.find('#target-date').val();
	    var newDate = dateFilter(scope.new_node.target_date, 'yyyy-MM-dd');
	    scope.active_msg.$defer({target_date: newDate})
		.then(function(message) {
		    var s = 'Deferred until ';
		    s += dateFilter(message.rcvd_date, 'yyyy-MM-dd');
		    toaster.pop('info', null, s);
		    console.log('rescheduled');
		    console.log(message);
		});
	    
	};
	scope.delete_node = function() {
	    // Delete the message in the database
	    scope.delete_modal.hide();
	    scope.active_msg.$delete().then(function() {
		scope.messages.splice(
		    scope.messages.indexOf(scope.active_msg),
		    1
		);
	    });
	    // scope.active_msg.delete_msg(scope.new_node);
	};
    }
    return {
	link: link,
	scope: false,
	templateUrl: '/static/message-modals.html'
    };
}]);
