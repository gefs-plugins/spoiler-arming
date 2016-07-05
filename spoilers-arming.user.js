// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://*.gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.3.0
// @grant none
// ==/UserScript==

/*!
	Copyright (c) 2015-2016 Harry Xue
	Licensed under the MIT License
*/

!function(t,a){a.appendTo(".gefs-ui-bottom");var e=setInterval(function(){window.gefs&&gefs.aircraft&&gefs.aircraft.object3d&&(clearInterval(e),t())},16)}(function(){function t(){var e=gefs.aircraft.animationValue.altitude-gefs.groundElevation*metersToFeet;return gefs.aircraft.groundContact&&0===gefs.aircraft.animationValue.airbrakesPosition?(controls.setters.setAirbrakes.set(),i=!1,void a()):gefs.aircraft.groundContact?(i=!1,void a()):(clearInterval(n),void(n=s>=e?setInterval(t,1500):setInterval(t,3e4)))}function a(){instruments.list.spoilers?i?(e(),n=setInterval(t,1500)):(e(),clearInterval(n)):(r(),clearInterval(n))}function e(){o?i?c.addClass("mdl-button--accent"):c.removeClass("mdl-button--accent"):(o=!0,c.removeAttr("disabled"))}function r(){o=!1,i=!1,c.is(":disabled")||c.attr("disabled",!0)}var n,i=!1,o=!0,s=4e3,c=$(".spoilers-arming-button");$(function(){a()}),c.click(function(){o&&(i=gefs.aircraft.groundContact?!1:!i,a())}),$(document).keydown(function(t){(220===t.which||220===t.keyCode)&&c.click()});var l=Aircraft.prototype.load;Aircraft.prototype.load=function(t,e,r){var n=gefs.aircraft.object3d._children;l.call(this,t,e,r);var o=setInterval(function(){n!==gefs.aircraft.object3d._children&&(clearInterval(o),i=!1,a())},16)}},$("<div>").addClass("spoilers-arming-section gefs-f-standard-ui").css("display","inline").append($("<button>").addClass("spoilers-arming-button mdl-button mdl-js-button mdl-button--raised").attr("data-upgraded",",MaterialButton").text("Spoilers")));
