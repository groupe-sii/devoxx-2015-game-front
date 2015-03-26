/* jshint devel:true */
/* globals RPG */
/**
 * ActionManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('ActionManager', function() {
  'use strict';

	var actionsList = [];

  function ActionManager(PubSub){
  	this.pubsub = PubSub;
  	this.currentPosition = {x:0, y:0};
  }
  ActionManager.prototype.initialize = function(dom){
  	this.dom = dom;
  	this.dom.drawActionsPanel(actionsList);
  	this.pubsub.subscribe('/gfx/item/selected', this.setSelectedPosition.bind(this));
  };
  ActionManager.prototype.addAction = function(actionName, actionFunction){
  	actionsList.push({
  		name: actionName,
  		action: (typeof actionFunction === 'function') ? actionFunction.bind(this) : function(){
  		this.sendAction(actionFunction);
  	}.bind(this)
  	});
  };
  ActionManager.prototype.setSelectedPosition = function(topic, cell){
  	this.currentPosition = cell;
  };
  ActionManager.prototype.runAction = function(index){
  	actionsList[index-1] && actionsList[index-1].action.apply(this, [this.currentPosition]);
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