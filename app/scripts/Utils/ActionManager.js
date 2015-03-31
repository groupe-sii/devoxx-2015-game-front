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
  var minActionDuration = 1000;

  function ActionManager(PubSub){
  	this.pubsub = PubSub;
  	this.currentPosition = {x:0, y:0};
  }
  ActionManager.prototype.initialize = function(dom){
  	this.dom = dom;
  	this.dom.drawActionsPanel(actionsList);
  	this.pubsub.subscribe('/gfx/cell/selected', this.setSelectedPosition.bind(this));
  };
  ActionManager.prototype.addAction = function(actionInfo, actionFunction){
  	
    function actionDefinition(){
      debugger;

      function send(){
        return this.sendAction(actionInfo.name, actionFunction);
      };

      if(actionInfo.repeat){
        return this.repeat(actionInfo.repeat.iteration, actionInfo.repeat.duration, send.bind(this));
      }
      else {
        return send.call(this);
      }
    }

    actionsList.push({
  		info: actionInfo,
  		action: actionDefinition.bind(this)
  	});
  };
  ActionManager.prototype.getSelectedPosition = function(){
    return this.currentPosition;
  };
  ActionManager.prototype.setSelectedPosition = function(topic, cell){
  	this.currentPosition = cell;
  };
  ActionManager.prototype.runAction = function(index){
  	actionsList[index] && actionsList[index].action.apply(this, [this.currentPosition]);
  };
  ActionManager.prototype.sendAction = function(actionName, actionDefinition){
    [].concat(actionDefinition.call(this)).forEach(function(action){
      
      this.pubsub.publish(RPG.config.topics.PUB_GAME_ACTION, action);

    }.bind(this));

  };
  ActionManager.prototype.repeat = function(howMany, howLong, action){
  	if(howLong < minActionDuration){
      throw Error('ActionManager::Repeat: Action duration should last more than '+minActionDuration/1000+'s ('+minActionDuration+'ms).');
    }

    var counter = 1;

    action.call(this);

  	var timer = setInterval(function(){
  		action.call(this);
  		if(++counter >= howMany){
  			clearInterval(timer);
  		}
  	}.bind(this), howLong);
  }

  return ActionManager;

});