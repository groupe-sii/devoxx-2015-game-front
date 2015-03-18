/* jshint devel:true */
/* globals RPG */
/**
 * GfxSubscriber module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxSubscriber', function() {
  'use strict';

  function GfxSubscriber(PubSub){
  	this.pubsub = PubSub;
  }

  GfxSubscriber.prototype.initialize = function(dom){
  	this.bindTopics(dom);
  	this.bindEvents(dom);
  };

  GfxSubscriber.prototype.bindTopics = function(dom){
  	this.pubsub.subscribe('/gfx/cell/click', function( /*topic, data*/ ) {});
    this.pubsub.subscribe('/gfx/item/place', function() {});
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_CREATED, function(topic, data) {
      dom.placeEntity(data);
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_LEFT_GAME, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if(entity){
        entity.destroy();
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if(!entity){
        entity = dom.placeEntity(data);
      }
      else {
        dom.moveTo(entity);
      }
      entity.avatar = data.player.playerInfo.avatar;
      entity.position = {
        current: data.newCell,
        previous: data.oldCell
      };
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_DIED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if(entity){
        entity.explode();
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_HIT, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if(entity){
        entity.hit(data.amount);
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_GAME_LEAVE, function(topic) {
      var entity = dom.findEntity();
      if(entity){
        entity.explode(true);
      }
    }.bind(this));

    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/close');
    }.bind(this))
  };

  GfxSubscriber.prototype.bindEvents = function(dom){
  	
    dom.boardContainer.on('click', function(e) {
      var cell = e.target;
      if (cell && cell.nodeName === 'TD' && !cell.classList.contains('rpg-occupied')) {
        cell.classList.toggle('rpg-selected');
        cell.classList.toggle('rpg-obstacle');
        this.pubsub.publish('/gfx/cell/click', {
          x: cell.dataset.x,
          y: cell.dataset.y
        });
      }
    });

    if (dom.joystick) {
      dom.joystick.on('click', function(e) {
        e.preventDefault();
        var move = e.target;
        if (move && move.nodeName === 'A') {
          this.pubsub.publish('/gfx/player/move', move.dataset.direction);
        }
      });
    }

    dom.joinBtn.on('click', function(e) {
      e.preventDefault();
      this.pubsub.publish(RPG.topics.PUB_GAME_JOIN, {
        name: dom.username.value,
        avatar: {
          '@c': '.ClientImage',
          name: dom.avatars.selected
        }
      });
    });
    
    this.pubsub.subscribe(RPG.topics.SUB_ME_JOINED_GAME, function() {
      dom.board.classList.remove('blur');
      dom.quitBtn.classList.remove('hidden');
      dom.menuContainer.classList.add('move-top');
    });

    dom.upperButtons.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'BUTTON') {
        switch (action.dataset.action) {
          case 'leave':
            dom.quitBtn.classList.add('hidden');
            dom.menuContainer.classList.remove('move-top');
            dom.board.classList.add('blur');
            this.pubsub.publish(RPG.topics.PUB_GAME_LEAVE);
            break;
        }
      }
    });

    dom.avatars.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'IMG') {
        action.parentElement.querySelector('.selected').classList.remove('selected');
        action.classList.add('selected');
        dom.avatars.selected = action.dataset.name;
      }
    });

    dom.spectatorBtn.on('click', function(e) {
      dom.board.classList.remove('blur');
      dom.quitBtn.classList.remove('hidden');
      dom.menuContainer.classList.add('move-top');
    });

    dom.username.on('keyup', function(e) {
      var value = e.target.value;
      if (value === '') {
        dom.joinBtn.setAttribute('disabled', true);
      } else {
        dom.joinBtn.removeAttribute('disabled');
        dom.username.value = value;
      }
    });

    document.addEventListener('keydown', function(e) {
      var topic = '';
      switch (e.which) {
        case 37: // left
          topic = RPG.topics.PUB_PLAYER_MOVE_LEFT;
          break;
        case 38: // up
          topic = RPG.topics.PUB_PLAYER_MOVE_UP;
          break;
        case 39: // right
          topic = RPG.topics.PUB_PLAYER_MOVE_RIGHT;
          break;
        case 40: // down
          topic = RPG.topics.PUB_PLAYER_MOVE_DOWN;
          break;
        default:
          return true;
      }
      this.pubsub.publish(topic);
      e.preventDefault();
    }.bind(this));
  }

  return GfxSubscriber;

});