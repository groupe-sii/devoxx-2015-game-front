/* jshint devel:true */
/* globals RPG */
/**
 * The main game loop
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {

  'use strict';


  var game = RPG.Factory.game();
  game.run();

  // var enemy = null;
  // var nbEnemy = 0;
  // for (var i = nbEnemy - 1; i >= 0; i--) {
  //   enemy = RPG.Factory.enemy();
  //   enemy.setLife(Math.random() * 100);
  //   game.addEnemy(enemy);
  // };
  
  // game.bots(true);
  // game.play();

});