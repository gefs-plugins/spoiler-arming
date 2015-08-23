// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.1.4
// @grant none
// ==/UserScript==
/*
	Copyright (c) 2015 Harry Xue

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/
!function(a){var t=setInterval(function(){window.ges&&ges.aircraft&&ges.aircraft.setup&&ges.aircraft.setup.instruments&&ges.aircraft.object3d&&(clearInterval(t),a())},4)}(function(){function a(){var r=void 0!==ges.aircraft.setup.instruments.spoilers,o=ges.aircraft.animationValue.altitude-ges.groundElevation*metersToFeet;r?(t(),s&&ges.aircraft.groundContact&&0===ges.aircraft.animationValue.airbrakesPosition&&(controls.setters.setAirbrakes.set(),s=!1,t()),clearInterval(i),i=n>=o?setInterval(a,1500):setInterval(a,3e4)):e()}function t(){r?s?$("#spoilers-arming").removeClass("btn-default").addClass("btn-success"):$("#spoilers-arming").removeClass("btn-success").addClass("btn-default"):(r=!0,$("#spoilers-arming").removeClass("btn-danger").addClass("btn-default"))}function e(){r=!1,s||$("#spoilers-arming").removeClass("btn-default").addClass("btn-danger"),s&&$("#spoilers-arming").removeClass("btn-success").addClass("btn-danger"),s=!1,clearInterval(i)}var s=!1,r=!0,n=4e3,i=setInterval(a,1500);$("#spoilers-arming").click(function(){r&&(s=ges.aircraft.groundContact?!1:s?!1:!0,t())}),$(document).keydown(function(a){(220===a.which||220===a.keyCode)&&$("#spoilers-arming").click()});var o=Aircraft.prototype.load;Aircraft.prototype.load=function(x,u,e){var r=ges.aircraft.object3d._children;o.call(this,x,u,e);var n=setInterval(function(){r!==ges.aircraft.object3d._children&&(clearInterval(n),a())},16)}});var h=$("<div>").addClass("setup-section").css("padding-bottom","0px").append($("<div>").addClass("input-prepend input-append").css("margin-bottom","4px").append($("<span>").addClass("add-on").text("Spoilers"),$("<button>").addClass("btn btn-default").attr("type","button").css("height","30px").css("width","30px").attr("id","spoilers-arming"))).appendTo(".gefs-f-standard");