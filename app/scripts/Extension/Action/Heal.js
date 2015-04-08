/* jshint devel:true */
/* globals RPG */
/**
 * Heal the player.
 * @type {Class}
 * @author Aurélien Baudet
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'Heal',
  icon: 'images/hud/heal.png'
}, function() {
  
  'use strict';
  
    // get the position of your player
	var player = RPG.Factory.gfx().dom.findEntity();
	var cell = player.position.current;

  return {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: 500 + Math.random() * 1000
  };
});