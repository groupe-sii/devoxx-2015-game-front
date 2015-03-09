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
  Game.prototype.addPlayer = function(player) {
    this.player = player;
    this.place(player);
  };
  Game.prototype.removePlayer = function(position) {
    this.gfx.remove(position).removePlayer(position);
  };
  Game.prototype.addEnemy = function(player) {
    player.setPosition(generatePosition_(this.gfx.gridSize));
    this.place(player);
    this.players.push(player);
  };
  Game.prototype.run = function() {

    this.pubsub.subscribe('/gfx/cell/click', function( /*topic, data*/ ) {});
    
    this.pubsub.subscribe('/gfx/item/place', function() {});
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_JOINED, function(topic, data) {
      var player = RPG.Factory.player();
      player.setName(data.player.playerInfo.name);
      player.setAvatar(data.player.playerInfo.avatar);
      player.setPosition(data.newCell);
      this.addPlayer(player);
    }.bind(this));
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_LEFT, function(topic, data) {
      this.removePlayer(data.oldCell);
    }.bind(this));
    
    this.pubsub.subscribe(RPG.topics.SUB_OTHER_JOINED, function(topic, data) {});
    
    this.on('beforeunload', function() {
      this.transport.close();
    }.bind(this));
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      var position = this.gfx.move({
        x: data.oldCell.x,
        y: data.oldCell.y
      }, {
        x: data.newCell.x,
        y: data.newCell.y
      });
      this.player.setPosition(position);
    }.bind(this));
  };
  Game.prototype.place = function(player) {
    return this.gfx.place(player);
  };
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