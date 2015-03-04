/* jshint devel:true */
/* globals RPG */
/**
 * The main game loop
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {

  'use strict';

  var transport = RPG.Factory.transport();
  var player = RPG.Factory.player('Wizard');
  var game = RPG.Factory.game();
  var enemy = null;
  var nbEnemy = 0;
  
  for (var i = nbEnemy - 1; i >= 0; i--) {
    enemy = RPG.Factory.enemy();
    enemy.setLife(Math.random() * 100);
    game.addEnemy(enemy);
  };
  
  game.addPlayer(player);
  // game.bots(true);
  // game.play();

});