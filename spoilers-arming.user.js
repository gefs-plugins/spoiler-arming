// ==UserScript==
// @name GeoFS Spoilers Arming
// @description This extension (by Harry Xue) allows the user to arm the spoilers before landing.
// @namespace GeoFS-Plugins
// @match http://*/geofs.php*
// @run-at document-end
// @version 0.4.1
// @grant none
// ==/UserScript==

/**
 * @license Spoilers-Arming
 * Copyright (c) 2015-2017 Harry Xue
 * Released under the MIT License (MIT)
 */

!function(n){var i=setInterval(function(){window.geofs&&geofs.aircraft&&geofs.aircraft.instance&&geofs.aircraft.instance.object3d&&(clearInterval(i),n())},100)}(function(){var n,i=geofs.aircraft.instance,a=!1,e=function(n){if(0===arguments.length)return 0!==i.animationValue.airbrakesTarget&&(a=!1),0===i.animationValue.airbrakesPosition&&a;o()&&(a=!!n)},t=!0,o=function(n){if(0===arguments.length)return t;n||e(!1),t=!!n};geofs.api.addFrameCallback(function(){geofs.aircraft.instance.animationValue.spoilersArmed=e(),e()&&i.groundContact?(0===i.animationValue.maxAngularVRatio||n||(n=i.animationValue.maxAngularVRatio),i.animationValue.maxAngularVRatio!==n&&n>=300&&i.animationValue.maxAngularVRatio>=2&&i.animationValue.maxAngularVRatio<10&&(1!==controls.airbrakes.target&&controls.setters.setAirbrakes.set(),n=void 0,e(!1))):n=void 0},"spoilersArming"),instruments.definitions.spoilersArming={overlay:{url:PAGE_PATH+"images/hx/spoilers-arm.png",alignment:{x:"right",y:"bottom"},size:{x:100,y:21},position:{x:20,y:195},anchor:{x:100,y:0},rescale:!0,rescalePosition:!0,animations:[{type:"show",value:"spoilersArmed",when:[!0]}]}};var r=controls.keyDown;controls.keyDown=function(n){n.shiftKey&&n.which===geofs.preferences.keyboard.keys["Airbrake toggle (on/off)"].keycode?e(!!o()&&!e()):r(n)};var s=instruments.init;instruments.init=function(n){void 0!==n.spoilers?(e(!1),o(!0),n.spoilersArming=n.spoilers):o(!1),s(n)},$(function(){instruments.init(i.setup.instruments)})});
