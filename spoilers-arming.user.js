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
function S(){if(window.ges&&ges.aircraft&&ges.aircraft.setup&&ges.aircraft.setup.instruments){var e=void 0!==ges.aircraft.setup.instruments.spoilers,a=(ges.aircraft.animationValue.altitude||0)-(ges.groundElevation||0)*metersToFeet;e?(u(),I&&ges.aircraft.groundContact&&0===(ges.aircraft.animationValue.airbrakesPosition||0)&&(controls.setters.setAirbrakes.set(),I=!1,u()),clearInterval(Y),Y=G>=a?setInterval(S,1500):setInterval(S,3e4)):(l(),clearInterval(Y))}}function u(){M?I?$("#spoilers-arming").removeClass("btn-default").addClass("btn-success"):$("#spoilers-arming").removeClass("btn-success").addClass("btn-default"):(M=!0,$("#spoilers-arming").removeClass("btn-danger").addClass("btn-default"))}function l(){M=!1,I||$("#spoilers-arming").removeClass("btn-default").addClass("btn-danger"),I&&$("#spoilers-arming").removeClass("btn-success").addClass("btn-danger"),I=!1}var I=!1,M=!0,G=4e3,Y=setInterval(S,1500),h=$("<div>").addClass("setup-section").css("padding-bottom","0px").append($("<div>").addClass("input-prepend input-append").css("margin-bottom","4px").append($("<span>").addClass("add-on").text("Spoilers"),$("<button>").addClass("btn btn-default").attr("type","button").css("height","30px").css("width","30px").attr("id","spoilers-arming"))).appendTo(".gefs-f-standard");$("#spoilers-arming").click(function(){M&&(I=ges.aircraft.groundContact?!1:I?!1:!0,u())}),$(document).keydown(function(e){(220===e.which||220===e.keyCode)&&$("#spoilers-arming").click()});var T=setInterval(function(){if(ges.aircraft.object3d){clearInterval(T);var e=Aircraft.prototype.load;Aircraft.prototype.load=function(a,r,g){var t=ges.aircraft.object3d._children;e.call(this,a,r,g);var i=setInterval(function(){t!==ges.aircraft.object3d._children&&(clearInterval(i),S())},16)}}},16);