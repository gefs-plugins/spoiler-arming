// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GeoFS-Plugins
// @match http://*/geofs.php*
// @run-at document-end
// @version 0.4.0
// @grant none
// ==/UserScript==

/**
 * @license Spoilers-Arming
 * Copyright (c) 2015-2017 Harry Xue
 * Released under the MIT License (MIT)
 */

!function(n){var i=setInterval(function(){window.geofs&&geofs.aircraft&&geofs.aircraft.instance&&geofs.aircraft.instance.object3d&&(clearInterval(i),n())},100)}(function(){function n(){t()&&(e.groundContact?(0===e.animationValue.maxAngularVRatio||i||(i=e.animationValue.maxAngularVRatio),e.animationValue.maxAngularVRatio!==i&&i>=300&&e.animationValue.maxAngularVRatio>=2&&e.animationValue.maxAngularVRatio<10&&(1!==controls.airbrakes.target&&controls.setters.setAirbrakes.set(),i=void 0,t(!1))):i=void 0)}var i,e=geofs.aircraft.instance,a=!1,t=function(n){if(0===arguments.length)return 0!==e.animationValue.airbrakesTarget&&(a=!1),0===e.animationValue.airbrakesPosition&&a;r()&&(a=!!n)},o=!0,r=function(n){if(0===arguments.length)return o;n||t(!1),o=!!n};geofs.api.addFrameCallback(function(){n(),geofs.aircraft.instance.animationValue.spoilersArmed=t()},"spoilersArming"),instruments.definitions.spoilersArming={overlay:{url:"https://dl.dropboxusercontent.com/s/pjji50e8ogwinmr/spoilers-arm.png",alignment:{x:"right",y:"bottom"},size:{x:100,y:21},position:{x:20,y:195},anchor:{x:100,y:0},rescale:!0,rescalePosition:!0,animations:[{type:"show",value:"spoilersArmed",when:[!0]}]}},$(document).off("keydown",controls.keyDown).on("keydown",function(n){n.shiftKey&&n.which===geofs.preferences.keyboard.keys["Airbrake toggle (on/off)"].keycode?t(!!r()&&!t()):controls.keyDown(n)});var s=instruments.init;instruments.init=function(n){void 0!==n.spoilers?(t(!1),r(!0),$.extend(n,{spoilersArming:n.spoilers})):r(!1),s(n)},$(function(){instruments.init(e.setup.instruments)})});
