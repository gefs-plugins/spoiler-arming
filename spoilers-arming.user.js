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
	var timer = setInterval(function () {
		if (window.geofs && geofs.aircraft && geofs.aircraft.instance && geofs.aircraft.instance.object3d) {
			clearInterval(timer);
			init();
		}
	}, 100);
})(function () {
	var initialWheelAccel, aircraft = geofs.aircraft.instance;

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

	// Adds callback after every frame to update spoilersArmed animation value and status
	geofs.api.addFrameCallback(function () {
		spoilersArming();
		geofs.aircraft.instance.animationValue.spoilersArmed = armed();
	}, 'spoilersArming');

	// Instrument overlay definition
	instruments.definitions.spoilersArming = {
		overlay: {
			url: 'https://dl.dropboxusercontent.com/s/pjji50e8ogwinmr/spoilers-arm.png',
			alignment: { x: 'right', y: 'bottom' },
			size: { x: 100, y: 21 },
			position: { x: 20, y: 195 },
			anchor: { x: 100, y: 0 },
			rescale: true,
			rescalePosition: true,
			animations: [{
				type: 'show',
				value: 'spoilersArmed',
				when: [ true ]
			}]
		}
	};

	// Sets <Shift> + airbrake toggle key for spoilers arming
	$(document)
		.off('keydown', controls.keyDown)
		.on('keydown', function (event) {
			if (event.shiftKey &&
				event.which === geofs.preferences.keyboard.keys['Airbrake toggle (on/off)'].keycode) {
				armed(enabled() ? !armed() : false);
			} else controls.keyDown(event);
		});

 	// Checks for spoilers arming status, called at every frame
	function spoilersArming () {
		if (!armed()) return;
		if (!aircraft.groundContact) {
			initialWheelAccel = undefined;
			return;
		}

		if (aircraft.animationValue.maxAngularVRatio !== 0 && !initialWheelAccel)
			initialWheelAccel = aircraft.animationValue.maxAngularVRatio;

		// Touched down and stablized
		var tdStable = aircraft.animationValue.maxAngularVRatio !== initialWheelAccel &&
			initialWheelAccel >= 300 && aircraft.animationValue.maxAngularVRatio >= 2 &&
			aircraft.animationValue.maxAngularVRatio < 10;

		if (tdStable) {
			if (controls.airbrakes.target !== 1) controls.setters.setAirbrakes.set();
			initialWheelAccel = undefined;
			armed(false);
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
	});
});
