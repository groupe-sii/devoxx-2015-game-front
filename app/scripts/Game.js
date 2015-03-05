/* jshint devel:true */
/* globals RPG */
/**
 * Game module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Game', function() {
  
  'use strict';

	function generatePosition_(gridSize) {
		return {
			x: ((Math.random() * gridSize) | 0),
			y: ((Math.random() * gridSize) | 0)
		};
	}

	function Game(Gfx, PubSub) {
		this.player = null;
		this.pubsub = PubSub;
		this.gfx = Gfx;
		this.players = [];
		this.selectedEnemy = null;
		this.botsInterval = null;
	};
	Game.prototype.on = function(topic, callback){
		this.pubsub.subscribe(topic, function(topic, data){
			callback(data);
		});
		return this;
	}
	Game.prototype.addPlayer = function(player, position) {
		this.player = player;
		this.player.setPosition(position);
		this.place(player);
	};
	Game.prototype.removePlayer = function(position){
		this.gfx.remove(position).removePlayer(position);
	}
	Game.prototype.addEnemy = function(player) {
		player.setPosition(generatePosition_(this.gfx.gridSize));
		this.place(player);
		this.players.push(player);
	};
	Game.prototype.run = function() {
		var self = this;

		this.pubsub.subscribe('/gfx/cell/click', function(topic, o) {});
		this.pubsub.subscribe('/gfx/item/place', function() {});
		this.pubsub.subscribe('/gfx/player/move', function(topic, direction) {
			var position = self.gfx.move({
				x: self.player.position.x,
				y: self.player.position.y,
				direction: direction
			});
			self.player.setPosition(position);
		});
		this.pubsub.subscribe('/gfx/enemy/move', function(topic, id) {
			var neighbours = self.gfx.getFreeNeighbours(self.players[id].position);
			if(neighbours.length>0){
				var position = self.gfx.move({
					x: self.players[id].position.x,
					y: self.players[id].position.y,
					direction: neighbours[(Math.random() * neighbours.length | 0)].direction
				});
				self.players[id].setPosition(position);
			}
		});
		this.pubsub.subscribe('/gfx/item/hit', function(topic, amout) {
			self.player.hit(amout);
		});
		this.pubsub.subscribe('/gfx/item/selected', function(topis, item) {
			self.players.forEach(function(p) {
				var pos = p.getPosition();
				if (pos.x === item.x && pos.y === item.y) {
					self.selectedEnemy = p;
					self.gfx.selectEnemy(p);
					return;
				}
			});
		});


		this.gfx.selectPlayer(this.player);
	};
	Game.prototype.place = function(player) {
		var obj = player.getPosition();
		return this.gfx.place({
			x: obj.x,
			y: obj.y,
			avatar: player.getAvatar(),
			name: player.getName(),
			life: player.getLife()
		});
	};

	Game.prototype.bots = function(state) {
		if(state){
			this.botsInterval = setInterval(function(){
				// var id = (Math.random() * this.players.length | 0);

				for (var i = this.players.length - 1; i >= 0; i--) {
					this.pubsub.publish('/gfx/enemy/move', i);
				};

				// this.pubsub.publish('/gfx/enemy/move', id);
			}.bind(this), 400);
		}
		else {
			clearInterval(this.botsInterval);
		}
	};

	return Game;

});