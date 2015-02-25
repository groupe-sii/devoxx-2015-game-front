/* jshint devel:true */
/* globals RPG */
/**
 * Player entity
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.entity('Player', function() {
  
  'use strict';

  function Player() {
    this.name = 'Player';
    this.avatar = 'images/players-sprites/fake.gif';
    this.life = 100;
    this.position = {
      x: 0,
      y: 0
    };
  }
  Player.prototype.setLife = function(life) {
    this.life = life;
  };
  Player.prototype.getLife = function() {
    return this.life;
  };
  Player.prototype.getAvatar = function() {
    return this.avatar;
  };
  Player.prototype.getName = function() {
    return this.name;
  };
  Player.prototype.setPosition = function(obj) {
    this.position = obj;
  };
  Player.prototype.getPosition = function() {
    return this.position;
  };
  Player.prototype.hit = function(amout) {
    this.life -= amout;
  };
  return Player;
});