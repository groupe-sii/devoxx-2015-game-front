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

  function Game(Gfx, PubSub, Transport) {
    this.player = null;
    this.pubsub = PubSub;
    this.transport = Transport;
    this.gfx = Gfx;
    this.players = [];
    this.selectedEnemy = null;
    this.botsInterval = null;
  }
  Game.prototype.on = function(topic, callback) {
    var isTopic = topic.indexOf('/') !== -1;
    if (isTopic) {
      this.pubsub.subscribe(topic, function(topic, data) {
        callback(data);
      });
    } else {
      window.addEventListener(topic, callback);
    }
    return this;
  };
  // Game.prototype.addPlayer = function(player) {
  //   this.player = player;
  //   this.place(player);
  // };
  Game.prototype.removePlayer = function(position) {
    this.gfx.remove(position).removePlayer(position);
  };
  // Game.prototype.addEnemy = function(player) {
  //   player.position = (generatePosition_(this.gfx.gridSize));
  //   this.place(player);
  //   this.players.push(player);
  // };
  Game.prototype.run = function() {

    this.pubsub.subscribe('/gfx/cell/click', function( /*topic, data*/ ) {});
    
    this.pubsub.subscribe('/gfx/item/place', function() {});
    
    this.pubsub.subscribe(RPG.config.topics.SUB_PLAYER_JOINED, function(topic, data) {
      
      this.gfx.placeEntity(data, 'player');
      
    //   debugger;
    //   var enemy = null;
    //   var nbEnemy = 5;
    //   for (var i = nbEnemy - 1; i >= 0; i--) {
    //     enemy = this.gfx.createEntity({
    //       life: (Math.random() * 100),
    //       position: generatePosition_(this.gfx.gridSize)
    //     }, 'enemy');
    //     this.gfx.placeEntity(enemy);
		  // };
		  
    }.bind(this));
    
    this.pubsub.subscribe(RPG.config.topics.SUB_PLAYER_LEFT, function(topic, data) {
      this.removePlayer(data.oldCell);
    }.bind(this));
    
    this.pubsub.subscribe(RPG.config.topics.SUB_OTHER_JOINED, function(topic, data) {});
    
    this.on('beforeunload', function() {
      this.transport.close();
    }.bind(this));
    
    this.pubsub.subscribe(RPG.config.topics.SUB_PLAYER_MOVED, function(topic, data) {
      this.gfx.moveTo(data);
    }.bind(this));
  };
  // Game.prototype.place = function(player) {
  //   return this.gfx.place(player);
  // };
  Game.prototype.bots = function(state) {
    if (state) {
      this.botsInterval = setInterval(function() {
        // var id = (Math.random() * this.players.length | 0);
        for (var i = this.players.length - 1; i >= 0; i--) {
          this.pubsub.publish('/gfx/enemy/move', i);
        }
        // this.pubsub.publish('/gfx/enemy/move', id);
      }.bind(this), 400);
    } else {
      clearInterval(this.botsInterval);
    }
  };
  return Game;
});