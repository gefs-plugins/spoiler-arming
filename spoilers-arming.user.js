// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.1.3
// @grant none
// ==/UserScript==

// If spoilers are armed
var armed = false;

// If spoilers are eligible to be armed
var enabled = true;

// The AGL altitude which the timer will update faster
var targetAlt = 4000;

/**
 * Checks for spoilers arming status, set on a timer
 */
var spoilersTimer = setInterval(armSpoilers, 1500);
function armSpoilers() {
	
	// If an aircraft has completed loading
	if (window.ges && ges.aircraft && ges.aircraft.setup && ges.aircraft.setup.instruments) {
		
		// If this aircraft is eligible for spoiler arming
		var hasSpoilers = ges.aircraft.setup.instruments.spoilers !== undefined; 
		
		// The current "At Ground Level" of the plane
		var AGL = (ges.aircraft.animationValue.altitude || 0) - (ges.groundElevation || 0) * metersToFeet;

		if (hasSpoilers) {
			update();
			if (armed) {
				if (ges.aircraft.groundContact && (ges.aircraft.animationValue.airbrakesPosition || 0) === 0) {
					controls.setters.setAirbrakes.set();
					armed = false;
					update();
				}
			}
			clearInterval(spoilersTimer);
			if (AGL <= targetAlt) spoilersTimer = setInterval(armSpoilers, 1500);
			else spoilersTimer = setInterval(armSpoilers, 30000);	
		} else disable();
	}
}

/**
 * Updates the button to show armed status
 * Enables arming if eligible
 */
function update() {
	if (!enabled) {
		enabled = true;
		$('#spoilers-arming')
			.removeClass('btn-danger')
			.addClass('btn-default');
	} else {
		if (armed)
			$('#spoilers-arming')
			.removeClass('btn-default')
			.addClass('btn-success');
		else
			$('#spoilers-arming')
			.removeClass('btn-success')
			.addClass('btn-default');
	}
}

/**
 * Disables arming
 */
function disable() {
	enabled = false;
	if (!armed) $('#spoilers-arming')
		.removeClass('btn-default')
		.addClass('btn-danger');
	if (armed) $('#spoilers-arming')
		.removeClass('btn-success')
		.addClass('btn-danger');
	armed = false;
	clearInterval(spoilersTimer);
}

/**
 * Spoilers arming UI
 */
var spoilersArmUI =
	$('<div>')
	.addClass('setup-section')
	.css('padding-bottom', '0px')
	.append(
		$('<div>')
		.addClass('input-prepend input-append')
		.css('margin-bottom', '4px')
		.append(
			$('<span>')
			.addClass('add-on')
			.text('Spoilers')
			, $('<button>')
			.addClass('btn btn-default')
			.attr('type', 'button')
			.css('height', '30px')
			.css('width', '30px')
			.attr('id', 'spoilers-arming')
		)
	).appendTo('.gefs-f-standard');

/**
 * Checks for "click" on the spoilers arming button
 */
$('#spoilers-arming').click(function () {
	if (enabled) {
		if (!ges.aircraft.groundContact) {
			if (!armed) armed = true;
			else armed = false;
		} else armed = false;
		
		update();
	}
});

/**
 * Checks for keydown "\" to set spoilers
 */
$(document).keydown(function (event) {
	if (event.which === 220 || event.keyCode === 220) // The "\" key
		$('#spoilers-arming').click();
});


/**
 * Redefines load function of Aircraft so that it 
 * checks for availability on aircraft load
 */
var prototypeTimer = setInterval(function () {
	
	// If an Aircraft object is created 
	// and the Aircraft object has completed loading
	if (ges.aircraft.object3d) {
		clearInterval(prototypeTimer);
		
		// Redefines the load() function under Aircraft
		var oldLoad = Aircraft.prototype.load;
		Aircraft.prototype.load = function (aircraftName, coordinates, bJustReload) {
			// Obtains the old aircraft parts {Object} before loading
			var oldParts = ges.aircraft.object3d._children;
			
			// Calls the original function to load an aircraft
			oldLoad.call(this, aircraftName, coordinates, bJustReload);
			
			// Checks if the old parts refer to a different object compared with the current parts
			// It's crucial to set on a timer because it takes time for the models to load completely
			var timer = setInterval(function () {
				if (oldParts !== ges.aircraft.object3d._children) {
					clearInterval(timer);
					armSpoilers();
				}
			}, 16);
		};
	}
}, 16);
