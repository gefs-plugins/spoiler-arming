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
function S(){var e=ges.aircraft.setup.instruments||void 0,a=e&&void 0!==e.spoilers,s=ges.aircraft.animationValue.altitude-ges.groundElevation*metersToFeet||0;a?(T(),q&&ges.aircraft.groundContact&&0===ges.aircraft.animationValue.airbrakesPosition&&(controls.setters.setAirbrakes.set(),q=!1,T())):L(),clearInterval(x),x=gg>=s?setInterval(S,1500):setInterval(S,3e4)}function T(){p?q?$("#spoilers-arming").removeClass("btn-default").addClass("btn-success"):$("#spoilers-arming").removeClass("btn-success").addClass("btn-default"):(p=!0,$("#spoilers-arming").removeClass("btn-danger").addClass("btn-default"))}function L(){p=!1,q||$("#spoilers-arming").removeClass("btn-default").addClass("btn-danger"),q&&$("#spoilers-arming").removeClass("btn-success").addClass("btn-danger"),q=!1}var q=!1,p=!0,gg=4e3,x=setInterval(S,1500),w=$("<div>").addClass("setup-section").css("padding-bottom","0px").append($("<div>").addClass("input-prepend input-append").css("margin-bottom","4px").append($("<span>").addClass("add-on").text("Spoilers"),$("<button>").addClass("btn btn-default").attr("type","button").css("height","30px").css("width","30px").attr("id","spoilers-arming"))).appendTo(".gefs-f-standard");$("#spoilers-arming").click(function(){p&&(q=ges.aircraft.groundContact?!1:q?!1:!0,T())}),$(document).keydown(function(e){(220===e.which||220===e.keyCode)&&$("#spoilers-arming").click()});var A=Aircraft.prototype.load;Aircraft.prototype.load=function(e,a,s){var r=ges.aircraft.object3d._children;A.call(this,e,a,s);var t=setInterval(function(){r!==ges.aircraft.object3d._children&&(clearInterval(t),S())},16)};