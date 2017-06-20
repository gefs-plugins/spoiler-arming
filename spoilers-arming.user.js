// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GeoFS-Plugins
// @match http://*/geofs.php*
// @run-at document-end
// @version 0.4.0
// @grant none
// ==/UserScript==

(function (init, ui) {
	// Inits UI elements
	ui.appendTo('.geofs-ui-bottom');

	// Checks if the game completes loading
	// and if all needed objects are created
	// Inits arming
	var timer = setInterval(function () {
		if (window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d) {
			clearInterval(timer);
			init();
		}
	}, 16);
})(function () {
	var armed = false; // If spoilers are armed
	var enabled = true;	// If spoilers are eligible to be armed
	var targetAlt = 4000; // The AGL altitude which the timer will update faster
	var spoilersTimer; // The timer to check for groundContact
	var button = $('.spoilers-arming-button');

	/**
 	 * Checks for spoilers arming status, set on a timer
 	 */
	function armSpoilers () {
		// The current "At Ground Level" of the plane
		var AGL = geofs.aircraft.instance.animationValue.altitude - geofs.groundElevation * METERS_TO_FEET;

		if (geofs.aircraft.instance.groundContact && geofs.aircraft.instance.animationValue.airbrakesPosition === 0) {
			controls.setters.setAirbrakes.set();
			armed = false;
			checkStatus();
			return;
		} else if (geofs.aircraft.instance.groundContact) {
			armed = false;
			checkStatus();
			return;
		}
		clearInterval(spoilersTimer);
		if (AGL <= targetAlt) spoilersTimer = setInterval(armSpoilers, 1500);
		else spoilersTimer = setInterval(armSpoilers, 30000);
	}

	/**
	 * Checks for arming status and controls the timer
	 */
	function checkStatus () {
		// If the plane does not have spoilers
		if (!instruments.list.spoilers) {
			disable();
			clearInterval(spoilersTimer);
		} else {
			if (armed) {
				update();
				spoilersTimer = setInterval(armSpoilers, 1500);
			} else {
				update();
				clearInterval(spoilersTimer);
			}
		}
	}

	/**
 	 * Updates the button to show armed status
 	 * Enables arming if eligible
 	 */
	function update () {
		if (!enabled) {
			enabled = true;
			button.removeAttr('disabled');
			button.show();
		} else {
			if (armed) button.addClass('mdl-button--accent');
			else button.removeClass('mdl-button--accent');
		}
	}

	/**
	 * Disables arming
	 */
	function disable () {
		enabled = false;
		armed = false;
		if (!button.is(':disabled')) button.attr('disabled', true);
		button.hide();
	}

	/**
	 * Checks for arming eligibility after page load
 	 */
	$(function () {
		checkStatus();
	});

	/**
	 * Checks for "click" on the spoilers arming button
 	 */
	button.click(function () {
		if (enabled) {
			if (!geofs.aircraft.instance.groundContact) armed = !armed;
			else armed = false;
			checkStatus();
		}
	});

	/**
	 * Checks for "\" keydown to set spoilers
	 */
	$(document).keydown(function (event) {
		if (event.which === 220 || event.keyCode === 220)
			button.click();
	});

	/**
 	 * Redefines load function of Aircraft so that it
 	 * checks for availability on aircraft load
	 */
	var oldLoad = geofs.aircraft.Aircraft.prototype.load;
	geofs.aircraft.Aircraft.prototype.load = function (aircraftName, coordinates, bJustReload) {
		// Obtains the old aircraft parts {Object} before loading
		var oldParts = geofs.aircraft.instance.object3d._children;

		// Calls the original function to load an aircraft
		oldLoad.call(this, aircraftName, coordinates, bJustReload);

		// Checks if the old parts refer to a different object compared
		// with the current parts. It's crucial to set on a timer because
		// it takes time for the models to load completely
		var timer = setInterval(function () {
			if (oldParts !== geofs.aircraft.instance.object3d._children) {
				clearInterval(timer);
				armed = false;
				checkStatus();
			}
		}, 16);
	};

	// Upgrades DOM element
	componentHandler.upgradeDom();
},
	/**
 	 * Spoilers arming UI
	 */
	$('<div>')
		.addClass('spoilers-arming-section geofs-f-standard-ui')
		.css('display', 'inline')
		.append($('<button>')
			.addClass('spoilers-arming-button mdl-button mdl-js-button mdl-button--raised')
			.text('Spoilers')
		)
);
