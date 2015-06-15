// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.1.1
// @grant none
// ==/UserScript==

var armed = false;
var enabled = true;
var spoilersAircrafts = {"a380": true, "md11": true, "67": true, "69": true, 
						"70": true, "84": true, "88": true, "89": true, 
						"114": true, "115": true, "156": true};

var spoilersArmTimer = setInterval(armSpoilers, 1500);
function armSpoilers() {
	if (spoilersAircrafts[ges.aircraft.name]) {
		update();
		if (armed) {
			if (ges.aircraft.groundContact && ges.aircraft.animationValue.airbrakesPosition === 0) {
				controls.setters.setAirbrakes.set();
				armed = false;
				update();
			}
		}
	}
	else disable();
}

// Updates the button
function update() {
	if (!enabled) {
		enabled = true;
		$('#spoilers-arming').removeClass('btn btn-danger').addClass('btn').text('Unarmed');
	}
	else {
		if (armed)
			$('#spoilers-arming').removeClass('btn').addClass('btn btn-info').text('Armed');
		else 
			$('#spoilers-arming').removeClass('btn btn-info').addClass('btn').text('Unarmed');
	}
}

// Disables the arming spoilers function if the aircraft is not eligible
function disable() {
	enabled = false;
	if (!armed) $('#spoilers-arming')
		.removeClass('btn')
		.addClass('btn btn-danger')
		.text('Disabled');
	if (armed) $('#spoilers-arming')
		.removeClass('btn btn-info')
		.addClass('btn btn-danger')
		.text('Disabled');
	armed = false;
}

// The spoilers arming display/button	
$('<div>')
	.addClass('setup-section')
	.css('padding-bottom','0px')
	.append($('<div>')
			.addClass('input-prepend input-append')
			.css('margin-bottom','4px')
			.append(
				$('<span>')
					.addClass('add-on')
					.text('Spoilers'),
				$('<button>')
					.addClass('btn')
					.css('height','30px')
					.css('width','80px')
					.attr('type','button')
					.attr('id', 'spoilers-arming')
					.text('Unarmed')
			)
	).appendTo('.gefs-f-standard');
	
// Event "click"
$('#spoilers-arming').click (function() {
	if (enabled) {
		if (!ges.aircraft.groundContact) {
			if (!armed) armed = true;
			else armed = false;
		}
		else armed = false;
		update();
	}
});