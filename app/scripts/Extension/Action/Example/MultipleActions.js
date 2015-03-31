/* jshint devel:true */
/* globals RPG */
/**
 * MultipleActions action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'MultipleActions',
  icon: 'images/hud/special_icons_0001.png'
}, function() {
  
  'use strict';

  var cell = RPG.Factory.actionManager().getSelectedPosition();
  var rand = ((Math.random() * 5000) |  0);
  var action1 = {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: Math.cos(Math.PI * Math.round(rand))
  };
  var action2 = {
    '@c': '.UpdateMaxCurrentLife',
    cell: cell,
    increment: ((Math.random() * 1000) |  0)
  };
  var action3 = {
    '@c': '.ChangePosition',
    start: cell,
    end: {
      x: ((Math.random() * RPG.config.game.board.height) | 0),
      y: ((Math.random() * RPG.config.game.board.width) | 0)
    }
  };
  return [action1, action2, action3];
});