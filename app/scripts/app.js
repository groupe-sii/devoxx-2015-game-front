/* jshint devel:true */
/* globals RPG */
/**
 * The main game loop
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {
  'use strict';
  
  var socket = RPG.Factory.transport();
  socket.initialize();

  if(RPG.audio){
	  var fx = RPG.Factory.fx();
	  fx.enable();
  }

  var action = RPG.Factory.action();
  action.initialize();

  var animation = RPG.Factory.animation();
  animation.initialize();

  var gfx = RPG.Factory.gfx();
  gfx.initialize();

});