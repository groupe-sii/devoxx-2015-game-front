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

  var fx = RPG.Factory.fx();
  fx.enable();

  var gfx = RPG.Factory.gfx();
  gfx.initialize();

});