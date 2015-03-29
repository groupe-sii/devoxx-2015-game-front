/* jshint devel:true */
/* globals RPG */
/**
 * Enemy entity
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.entity('Enemy', 'Player', function() {
  
  'use strict';

  var id = 1;

  function Enemy() {
    this.name = 'Enemy_'+(id++);
  }
  return Enemy;

});