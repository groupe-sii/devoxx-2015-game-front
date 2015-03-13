/* jshint devel:true */
/* globals RPG */
/**
 * Player entity
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.entity('Player', function() {
  'use strict';

  var id = 1;

  function Player() {
    this.name = 'Player_'+(id++);
    this.avatar = '';
    this.life = 100;
    this.position = {
      current: {
        x: 0,
        y: 0
      },
      previous: {
        x: 0,
        y: 0
      }
    };
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        this.autoSetterGetter(property);
      }
    }
  }
  Player.prototype.autoSetterGetter = function(property) {
    var upperProperty = property[0].toUpperCase() + property.slice(1);
    this['get' + upperProperty] = function() {
      return this[property];
    };
    this['set' + upperProperty] = function(value) {
      this[property] = value;
    };
  };
  return Player;

});