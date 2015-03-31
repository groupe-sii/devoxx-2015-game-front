/* jshint devel:true */
/* globals RPG */
/**
 * UpdateCurrentLifeRepeat action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'UpdateCurrentLifeRepeat',
  icon: 'images/hud/special_icons_0019.png',
  repeat: {
  	iteration: 2, 
  	duration: 1000
  }
}, function() {
  
  'use strict';
  
	var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: -((Math.random() * 1000) |  0)
  };
});