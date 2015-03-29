/* jshint devel:true */
/* globals RPG */
/**
 * The main game bootstrap
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {
  'use strict';

  var fx = RPG.Factory.fx();
  fx.initialize();
  
  var socket = RPG.Factory.transport();
  socket.initialize();

  var animation = RPG.Factory.animation();
  animation.initialize();

  var gfx = RPG.Factory.gfx();
  gfx.initialize();

});