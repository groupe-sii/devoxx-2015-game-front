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
	var game = null;
	var target = null;
	var player = null;
	var ia = null;
	var transport = null;
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
			return new RPG.Enemy(); // di.invoke(Enemy);
		},
		player: function(type) {
			type = RPG[type];
			if(type){
				if (!player) {
					player = di.invoke(type);
				}
				return player;
			}
			else {
				throw 'Player "'+type+'" does not exist';
			}
		},
		gfx: function() {
			if (!gfx) {
				gfx = di.invoke(RPG.Gfx);
			}
			return gfx;
		},
		game: function() {
			if (!game) {
				game = di.inject(RPG.Gfx).invoke(RPG.Game);
			}
			return game;
		},
		transport: function(){
			if(!transport){
				transport = di.invoke(RPG.Transport);
			}
			return transport;
		},
		ia: function() {
			if(!ia){
				ia = di.invoke(RPG.AI);
			}
			return ia;
		}
	};

});