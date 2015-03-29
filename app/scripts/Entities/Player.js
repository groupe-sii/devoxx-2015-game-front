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
    this.life = 1000;
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
  }
  return Player;

});