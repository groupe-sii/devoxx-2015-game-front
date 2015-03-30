/* jshint devel:true */
/* globals RPG */
/**
 * UpdateMaxLife action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'UpdateMaxLife',
  icon: 'images/hud/special_icons_0009.png'
}, function() {
  
  'use strict';

  var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.UpdateMaxLife',
    cell: cell,
    increment: ((Math.random() * 1000) |  0)
  };
});