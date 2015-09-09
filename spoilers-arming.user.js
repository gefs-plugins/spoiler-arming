// ==UserScript==
// @name GEFS-Online Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 0.1.5.patch-1
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
!function(h,x){x.appendTo(".gefs-f-standard");var t=setInterval(function(){window.ges&&ges.aircraft&&ges.aircraft.object3d&&(clearInterval(t),h())},16)}(function(){function a(){var t=ges.aircraft.animationValue.altitude-ges.groundElevation*metersToFeet;return ges.aircraft.groundContact&&0===ges.aircraft.animationValue.airbrakesPosition?(controls.setters.setAirbrakes.set(),r=!1,void s()):ges.aircraft.groundContact?(r=!1,void s()):(clearInterval(n),void(n=o>=t?setInterval(a,1500):setInterval(a,3e4)))}function s(){instruments.list.spoilers?r?(t(),n=setInterval(a,1500)):(t(),clearInterval(n)):(e(),clearInterval(n))}function t(){i?r?$(".spoilers-arming").removeClass("btn-default").addClass("btn-success"):$(".spoilers-arming").removeClass("btn-success").addClass("btn-default"):(i=!0,$(".spoilers-arming").removeClass("btn-danger").addClass("btn-default"))}function e(){i=!1,r=!1,$(".spoilers-arming").hasClass("btn-default")&&$(".spoilers-arming").removeClass("btn-default").addClass("btn-danger"),$(".spoilers-arming").hasClass("btn-success")&&$(".spoilers-arming").removeClass("btn-success").addClass("btn-danger")}var n,r=!1,i=!0,o=4e3;$(function(){s()}),$(".spoilers-arming").click(function(){i&&(r=ges.aircraft.groundContact?!1:!r,s())}),$(document).keydown(function(a){(220===a.which||220===a.keyCode)&&$(".spoilers-arming").click()});var l=Aircraft.prototype.load;Aircraft.prototype.load=function(x,u,e){var n=ges.aircraft.object3d._children;l.call(this,x,u,e);var i=setInterval(function(){n!==ges.aircraft.object3d._children&&(clearInterval(i),r=!1,s())},16)}},$("<div>").addClass("setup-section").css("padding-bottom","0px").append($("<div>").addClass("input-prepend input-append").css("margin-bottom","4px").append($("<span>").addClass("add-on").text("Spoilers"),$("<button>").addClass("btn btn-default spoilers-arming").attr("type","button").css("height","30px").css("width","30px"))));
