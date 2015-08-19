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
	var instruments = ges.aircraft.setup.instruments || undefined;
	var hasSpoilers = instruments && instruments.spoilers !== undefined;
	var AGL = ges.aircraft.animationValue.altitude - ges.groundElevation * metersToFeet || 0;
	
	if (hasSpoilers) {
		update();
		if (armed) {
			if (ges.aircraft.groundContact && ges.aircraft.animationValue.airbrakesPosition === 0) {
				controls.setters.setAirbrakes.set();
				armed = false;
				update();
			}
		}
	} else disable();
	
	clearInterval(spoilersTimer);
	if (AGL <= targetAlt) spoilersTimer = setInterval(armSpoilers, 1500);
	else spoilersTimer = setInterval(armSpoilers, 30000);
}

/**
 * Updates the button to show armed status
 * Enables arming if eligible
 */
function update() {
	if (!enabled) {
		enabled = true;
		$('#spoilers-arming').removeClass('btn-danger').addClass('btn-default');
	} else {
		if (armed)
			$('#spoilers-arming').removeClass('btn-default').addClass('btn-success');
		else 
			$('#spoilers-arming').removeClass('btn-success').addClass('btn-default');
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
}

/**
 * Spoilers arming UI
 */
var spoilersArmUI = 
$('<div>')
	.addClass('setup-section')
	.css('padding-bottom','0px')
	.append(
		$('<div>')
			.addClass('input-prepend input-append')
			.css('margin-bottom','4px')
			.append(
				$('<span>')
					.addClass('add-on')
					.text('Spoilers')
			, 	$('<button>')
					.addClass('btn btn-default')
					.attr('type','button')
                    .css('height','30px')
                   	.css('width','30px')
					.attr('id', 'spoilers-arming')
			)
	).appendTo('.gefs-f-standard');

/**
 * Checks for "click" on the spoilers arming button
 */
$('#spoilers-arming').click(function() {
	if (enabled) {
		if (!ges.aircraft.groundContact) {
			if (!armed) armed = true;
			else armed = false;
		}
		else armed = false;
		update();
	}
});

/**
 * Checks for keydown "\" to set spoilers
 */
$(document).keydown(function(event) {
	if (event.which === 220 || event.keyCode === 220) // The "\" key
		$('#spoilers-arming').click();
});

var oldLoad = Aircraft.prototype.load;
Aircraft.prototype.load = function (aircraftName, coordinates, bJustReload) {
	var oldParts = ges.aircraft.object3d._children;
	oldLoad.call(this, aircraftName, coordinates, bJustReload);
	var timer = setInterval(function() {
		if (oldParts !== ges.aircraft.object3d._children) {
			clearInterval(timer);
			armSpoilers();
		}
	},16);
};