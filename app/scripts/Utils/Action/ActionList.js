/* jshint devel:true */
/* globals RPG */
/**
 * ActionList module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('ActionList', function() {
  'use strict';


 	function ActionList(ActionManager){
  	this.actionManager = ActionManager;
  }
  ActionList.prototype.initialize = function(){
  	
  	this.addAction('updateLife', function(cell){
	  	return {
	      '@c': '.UpdateCurrentLife',
	      cell: cell,
	      increment: -((Math.random() * 1000) | 0)
	    };
	  });

	  this.addAction('updateMaxLife', function(cell){
	  	return {
	      '@c': '.UpdateMaxLife',
	      cell: cell,
	      increment: ((Math.random() * 1000) | 0)
	    };
	  });

	  this.addAction('changePosition', function(cell){
	  	return {
	      '@c': '.ChangePosition',
	      start: cell,
	      end: {
		      x: ((Math.random() * RPG.game.board.height) | 0),
	      	y: ((Math.random() * RPG.game.board.width) | 0)
	      }
	    };
	  });

	  this.addAction('addImageToBoard', function(cell, imageName){
	  	return {
	      '@c': '.AddImage',
	      start: cell,
	      image: {
	      	'@c': '.ClientImage',
	      	name: imageName
	      }
	    };
	  });

	  this.addAction('ChangeStates', function(cell){
	  	//@todo 
	  });

	  this.addAction('lockTarget', function(cell){
  		this.repeat(10, this.dom.findEntity(cell), function(entity){
  			this.actionsList[0].call(this, entity.position.current);
  		});
	  });

  }
  ActionList.prototype.addAction = function(action){
		this.actionManager.addAction(action);
  };

  return ActionList;

});
