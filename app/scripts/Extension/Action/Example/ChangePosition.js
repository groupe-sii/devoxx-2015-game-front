/* jshint devel:true */
/* globals RPG */
/**
 * ChangePosition action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'ChangePosition',
  icon: 'images/hud/special_icons_0013.png'
}, function() {
  
  'use strict';
  
	var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.ChangePosition',
    start: cell,
    end: {
      x: ((Math.random() * RPG.config.game.board.height) | 0),
      y: ((Math.random() * RPG.config.game.board.width) | 0)
    }
  };
});