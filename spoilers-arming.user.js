// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GeoFS-Plugins
// @match http://*/geofs.php*
// @run-at document-end
// @version 0.4.0
// @grant none
// ==/UserScript==

(function (init) {
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
	var targetAltLo = 100; // The AGL altitudes which the timer will update faster
	var targetAltHi = 4000;
	var spoilersTimer; // The timer to check for groundContact
	var aircraft = geofs.aircraft.instance;

	var _armed = false;
	var armed = function (bool) {
		if (arguments.length === 0) {
			if (aircraft.animationValue.airbrakesTarget !== 0) _armed = false;
			if (aircraft.animationValue.airbrakesPosition !== 0) return false;
			return _armed;
		}
		if (enabled()) _armed = !!bool;
	};

	var _enabled = true;
	var enabled = function (bool) {
		if (arguments.length === 0) return _enabled;
		if (!bool) armed(false);
		_enabled = !!bool;
	};

	// Instrument overlay definition
	instruments.definitions.spoilersArming = {
		overlay: {
			url: PAGE_PATH + 'local/spoilers-arm.png',
			alignment: { x: 'right', y: 'bottom' },
			size: { x: 100, y: 21 },
			position: { x: 20, y: 195 },
			anchor: { x: 100, y: 0 },
			rescale: true,
			rescalePosition: true,
			animations: [{
				type: 'show',
				value: armed,
				when: [ true ]
			}]
		}
	};

	$(document)
		.off('keydown', controls.keyDown)
		.keydown(function (event) {
			if (event.shiftKey &&
				event.which === geofs.preferences.keyboard.keys['Airbrake toggle (on/off)'].keycode) {
				event.preventDefault();
				armed(enabled() ? !armed() : false);
				checkStatus();
			} else controls.keyDown(event);
		});

	/**
 	 * Checks for spoilers arming status, set on a timer
 	 */
	function armSpoilers () { // @IDEA Use maxAngularVRatio instead? What is the threshold?
		if (aircraft.groundContact) {
			if (aircraft.animationValue.airbrakesTarget === 0) controls.setters.setAirbrakes.set();
			armed(false);
		}

		checkStatus();
	}

	/**
	 * Checks for arming status and controls the timer
	 */
	function checkStatus () {
		clearInterval(spoilersTimer);

		// The current "At Ground Level" of the plane
		var AGL = aircraft.animationValue.altitude - geofs.groundElevation * METERS_TO_FEET;

		if (armed()) {
			if (AGL < targetAltLo) spoilersTimer = setInterval(armSpoilers, 100);
			else if (AGL < targetAltHi) spoilersTimer = setInterval(armSpoilers, 1500);
			else spoilersTimer = setInterval(armSpoilers, 30000);
		}
	}

	// Redefines instrument init to check if aircraft has spoilers to arm
	var oldInit = instruments.init;
	instruments.init = function (instrumentList) {
		if (typeof instrumentList.spoilers !== 'undefined') {
			armed(false);
			enabled(true);
			$.extend(instrumentList, { spoilersArming: instrumentList.spoilers });
		} else enabled(false);

		oldInit(instrumentList);
	};

	/**
	 * Checks for arming eligibility after page load
 	 */
	$(function () {
		instruments.init(aircraft.setup.instruments);
		checkStatus();
	});
});
