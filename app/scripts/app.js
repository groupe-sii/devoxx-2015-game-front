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
  var game = RPG.Factory.game();
  var player = null;

  game.on(RPG.topics.SUB_PLAYER_JOINED, function(data){
    
    player = RPG.Factory.player();
    player.setName(data.player.playerInfo.name);
    player.setAvatar(data.player.playerInfo.avatar);
    game.addPlayer(player, data.newCell);

  })
  .on(RPG.topics.SUB_PLAYER_LEFT, function(data){

    game.removePlayer(data.oldCell);

  });

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