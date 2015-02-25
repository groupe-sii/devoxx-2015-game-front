/* jshint devel:true */
/* globals RPG */
/**
 * Enemy entity
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.entity('Enemy', 'Player', function() {
  
  'use strict';

  function Enemy() {
    this.name = 'Enemy ' + ((Math.random() * 10) | 0);
    this.avatar = 'images/players-sprites/dvl1_fr1.gif';
  }
  return Enemy;

});