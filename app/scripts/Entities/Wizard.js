/* jshint devel:true */
/* globals RPG */
/**
 * Wizard entity
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.entity('Wizard', 'Player', function() {
  
  'use strict';

  function Wizard() {
		this.avatar = 'images/players-sprites/amg1_fr1.gif';
		this.name = 'Wizard';
	}

	return Wizard;
  
});