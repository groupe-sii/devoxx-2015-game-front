/* jshint devel:true */
/* globals RPG */
/**
 * The main game loop
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {

  'use strict';

  var player = RPG.Factory.player('Wizard');
  var gfx = RPG.Factory.gfx();
  var game = RPG.Factory.game();
  var enemy = null;
  var nbEnemy = 30;
  
  for (var i = nbEnemy - 1; i >= 0; i--) {
    enemy = RPG.Factory.enemy();
    enemy.setLife(Math.random() * 100);
    game.addEnemy(enemy);
  };
  
  game.addPlayer(player);
  game.play();
  game.bots(true);

});