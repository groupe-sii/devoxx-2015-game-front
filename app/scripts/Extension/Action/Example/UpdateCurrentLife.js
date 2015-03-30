/* jshint devel:true */
/* globals RPG */
/**
 * UpdateCurrentLife action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'UpdateCurrentLife',
  icon: 'images/hud/special_icons_0015.png'
}, function() {
  
  'use strict';
  
	var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: -((Math.random() * 1000) |  0)
  };
});