/* jshint devel:true */
/* globals RPG */
/**
 * ActionManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('ActionManager', function() {
  'use strict';

	var actionsList = [
	 	function updateLife(cell){
	  	this.sendAction({
	      '@c': '.UpdateCurrentLife',
	      cell: cell,
	      amount: ((Math.random() * 1000) | 0)
	    });
	  },
	  function updateMaxLife(cell){
	  	this.sendAction({
	      '@c': '.UpdateMaxLife',
	      cell: cell,
	      amount: ((Math.random() * 1000) | 0)
	    });
	  },
	  function changePosition(cell){
	  	this.sendAction({
	      '@c': '.ChangePosition',
	      start: cell,
	      end: {
		      x: ((Math.random() * RPG.game.board.height) | 0),
	      	y: ((Math.random() * RPG.game.board.width) | 0)
	      }
	    });
	  },
	  function addImageToBoard(cell, imageName){
	  	this.sendAction({
	      '@c': '.AddImage',
	      start: cell,
	      image: {
	      	'@c': '.ClientImage',
	      	name: imageName
	      }
	    });
	  },
	  function ChangeStates(cell){
	  	//@todo 
	  },
	  function lockTarget(cell){
  		this.repeat(10, this.dom.findEntity(cell), function(entity){
  			actionsList[0].call(this, entity.position.current);
  		});
	  }
  ];

  function ActionManager(PubSub){
  	this.pubsub = PubSub;
  	this.currentPosition = {x:0, y:0};
  }
  ActionManager.prototype.initialize = function(dom){
  	this.dom = dom;
  	this.dom.drawActionsPanel(actionsList.map(function(fn){
  		return fn.name;
  	}));
  	this.pubsub.subscribe('/gfx/item/selected', this.setSelectedPosition.bind(this));
  };
  ActionManager.prototype.setSelectedPosition = function(topic, cell){
  	this.currentPosition = cell;
  };
  ActionManager.prototype.runAction = function(index){
  	actionsList[index-1] && actionsList[index-1].apply(this, [this.currentPosition]);
  };

  ActionManager.prototype.sendAction = function(action){
  	this.pubsub.publish(RPG.topics.PUB_GAME_ACTION, action);
  }
  ActionManager.prototype.repeat = function(howMany, target, callback){
  	if(!target){
  		return false;
  	}
  	var counter = 0;
  	var timer = setInterval(function(){
  		callback.call(this, target);
  		if(++counter >= howMany){
  			clearInterval(timer);
  		}
  	}.bind(this), 1000);
  }

  return ActionManager;

});