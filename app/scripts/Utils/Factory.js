/* jshint devel:true */
/* globals RPG */
/**
 * Factory module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Factory', function() {
  
  'use strict';

	var gfx = null;
	var fx = null;
	var player = null;
	var transport = null;
	var actionManager = null;
	var animationManager = null;
	var pubsub = null;
	var constructors = {};
	var di = RPG.Injector;

	return {
		instance: function(Constructor, target){
			if(!constructors[target]){
				Constructor.prototype = target.prototype;
				Constructor.prototype.constructor = target;
				constructors[target] = new Constructor();
			}
			return constructors[target];
		},
		enemy: function() {
			return di.invoke(RPG.Enemy);
		},
		animation: function() {
			// treat an animation entity as if is a player!!
			return di.invoke(RPG.Player);
		},
		player: function(type) {
			type = RPG[type] || RPG.Player;
			if(type){
				if (!player) {
					player = di.invoke(type);
				}
				return player;
			}
			else {
				throw 'Player type "'+type+'" does not exist';
			}
		},
		gfx: function() {
			if (!gfx) {
				gfx = di.invoke(RPG.GfxCore);
			}
			return gfx;
		},
		fx: function() {
			if (!fx) {
				fx = di.invoke(RPG.AudioManager);
			}
			return fx;
		},
		transport: function(){
			if(!transport){
				transport = di.invoke(RPG.Transport);
			}
			return transport;
		},
		actionManager: function(){
			if(!actionManager){
				actionManager = di.invoke(RPG.ActionManager);
			}
			return actionManager;
		},
		animationManager: function(){
			if(!animationManager){
				animationManager = di.invoke(RPG.AnimationManager);
			}
			return animationManager;
		},
		pubsub: function(){
			if(!pubsub){
				pubsub = di.invoke(RPG.PubSub);
			}
			return pubsub;
		}
	};

});