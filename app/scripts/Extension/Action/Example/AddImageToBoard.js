/* jshint devel:true */
/* globals RPG */
/**
 * ChangePosition action.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.extension(RPG.extensions.ACTION, {
  name: 'AddImage',
  icon: 'images/hud/special_icons_0007.png'
}, function() {
  
  'use strict';

  var cell = RPG.Factory.actionManager().getCurrentPosition();

	return {
    '@c': '.AddImage',
    start: cell,
    image: {
  		'@c': '.ClientImage',
    	name: 'images/hud/special_icons_0008.png'
    }
  };

});