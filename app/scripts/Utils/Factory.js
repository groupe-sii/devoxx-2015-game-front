/* jshint devel:true */
/* globals RPG,Enemy */
/**
 * Factory module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Factory', function() {
  
  'use strict';

	var gfx = null;
	var game = null;
	var player = null;
	var ia = null;
	var transport = null;
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
		game: function() {
			if (!game) {
				game = di.invoke(RPG.Game);
			}
			return game;
		},
		transport: function(){
			if(!transport){
				transport = di.invoke(RPG.Transport);
			}
			return transport;
		},
		pubsub: function(){
			if(!pubsub){
				pubsub = di.invoke(RPG.PubSub);
			}
			return pubsub;
		},
		ia: function() {
			if(!ia){
				ia = di.invoke(RPG.AI);
			}
			return ia;
		}
	};

});