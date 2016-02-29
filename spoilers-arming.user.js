// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://*.gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.2.0
// @grant none
// ==/UserScript==

/*!
	Copyright (c) 2015-2016 Harry Xue
	Licensed under the MIT License
*/

!function(h,x){x.appendTo(".gefs-f-standard");var t=setInterval(function(){window.gefs&&gefs.aircraft&&gefs.aircraft.object3d&&(clearInterval(t),h())},16)}(function(){function a(){var t=gefs.aircraft.animationValue.altitude-gefs.groundElevation*metersToFeet;return gefs.aircraft.groundContact&&0===gefs.aircraft.animationValue.airbrakesPosition?(controls.setters.setAirbrakes.set(),r=!1,void s()):gefs.aircraft.groundContact?(r=!1,void s()):(clearInterval(n),void(n=o>=t?setInterval(a,1500):setInterval(a,3e4)))}function s(){instruments.list.spoilers?r?(t(),n=setInterval(a,1500)):(t(),clearInterval(n)):(e(),clearInterval(n))}function t(){i?r?$(".spoilers-arming").removeClass("btn-default").addClass("btn-success"):$(".spoilers-arming").removeClass("btn-success").addClass("btn-default"):(i=!0,$(".spoilers-arming").removeClass("btn-danger").addClass("btn-default"))}function e(){i=!1,r=!1,$(".spoilers-arming").hasClass("btn-default")&&$(".spoilers-arming").removeClass("btn-default").addClass("btn-danger"),$(".spoilers-arming").hasClass("btn-success")&&$(".spoilers-arming").removeClass("btn-success").addClass("btn-danger")}var n,r=!1,i=!0,o=4e3;$(function(){s()}),$(".spoilers-arming").click(function(){i&&(r=gefs.aircraft.groundContact?!1:!r,s())}),$(document).keydown(function(a){(220===a.which||220===a.keyCode)&&$(".spoilers-arming").click()});var l=Aircraft.prototype.load;Aircraft.prototype.load=function(x,u,e){var n=gefs.aircraft.object3d._children;l.call(this,x,u,e);var i=setInterval(function(){n!==gefs.aircraft.object3d._children&&(clearInterval(i),r=!1,s())},16)}},$("<div>").addClass("setup-section").css("padding-bottom","0px").append($("<div>").addClass("input-prepend input-append").css("margin-bottom","4px").append($("<span>").addClass("add-on").text("Spoilers"),$("<button>").addClass("btn btn-default spoilers-arming").attr("type","button").css("height","30px").css("width","30px"))));
