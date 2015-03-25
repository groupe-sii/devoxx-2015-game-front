/* jshint devel:true */
/* globals RPG */
/**
 * GfxEventManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxEventManager', function() {
  'use strict';
  var isSpectatorMode = false;
  var directionKeyCodes = {
    37: {
      key: 'left',
      topic: RPG.topics.PUB_PLAYER_MOVE_LEFT
    },
    38: {
      key: 'up',
      topic: RPG.topics.PUB_PLAYER_MOVE_UP
    },
    39: {
      key: 'right',
      topic: RPG.topics.PUB_PLAYER_MOVE_RIGHT
    },
    40: {
      key: 'down',
      topic: RPG.topics.PUB_PLAYER_MOVE_DOWN
    }
  };

  function GfxEventManager(PubSub, ActionManager) {
  	this.actionManager = ActionManager;
    this.pubsub = PubSub;
  }
  GfxEventManager.prototype.initialize = function(dom) {
    this.bindTopics(dom);
    this.bindEvents(dom);
    this.actionManager.initialize(dom);
  };
  GfxEventManager.prototype.bindTopics = function(dom) {
    dom.debugBtn.on('change', function(e) {
      var debug = e.target.checked;
      var entities = dom.findEntities();
      entities.forEach(function(entity) {
        entity.debug = debug;
      });
    }.bind(this));
    this.s(RPG.topics.SUB_ME_GAME_SELECTED, function(topic, data){
    	dom.build(data);
    });
    this.s(RPG.topics.SUB_PLAYER_CREATED, function(topic, data) {
      dom.placeEntity(data);
    });
    this.s(RPG.topics.SUB_PLAYER_LIFE_LEVEL, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.life = data.player.life;
      }
    });
    this.s(RPG.topics.SUB_PLAYER_LEFT_GAME, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.destroy();
      }
    });
    this.s(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (!entity) {
        entity = dom.placeEntity(data);
      }
      entity.avatar = data.player.playerInfo.avatar;
      entity.position = {
        current: data.newCell,
        previous: data.oldCell
      };
      dom.moveTo(entity);
    });
    this.s(RPG.topics.SUB_PLAYER_DIED, function(topic, data) {
      var entity = dom.findEntity(data.id);
      if (entity) {
        entity.explode().setDead();
      }
    });
    this.s(RPG.topics.SUB_PLAYER_REVIVED, function(topic, data) {
      var entity = dom.findEntity(data.id);
      if (entity) {
        entity.revive(data);
      }
    });
    this.s(RPG.topics.SUB_PLAYER_HIT, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.hit(data.amount);
      }
    });
    this.s(RPG.topics.SUB_PLAYER_HEALED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.heal(data.amount);
      }
    });
    this.s(RPG.topics.PUB_GAME_LEAVE, function(topic) {
      var entity = dom.findEntity();
      if (entity) {
        entity.explode(true);
      }
    });
    this.s('/transport/close', function() {
      dom.showMessage('Connecting to server...');
    });
    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/close');
    }.bind(this));
  };
  GfxEventManager.prototype.bindEvents = function(dom) {
      dom.boardContainer.on('click', function(e) {
        var cell = e.target;
        if (cell && cell.nodeName === 'TD' && !cell.classList.contains('rpg-occupied')) {
          cell.classList.toggle('rpg-selected');
          cell.classList.toggle('rpg-obstacle');
          this.pubsub.publish('/gfx/item/selected', {
          	x: +cell.dataset.x,
						y: +cell.dataset.y
          });
        }
      }.bind(this));
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
      this.s(RPG.topics.SUB_ME_JOINED_GAME, function() {
        dom.board.classList.remove('blur');
        dom.quitBtn.classList.remove('hidden');
        dom.menuContainer.classList.add('move-top');
      });
      this.s(RPG.topics.SUB_ME_LEFT_GAME, function() {
        dom.quitBtn.classList.add('hidden');
        dom.menuContainer.classList.remove('move-top');
        dom.board.classList.add('blur');
        dom.selectPlayer(null);
      });
      dom.upperButtons.on('click', function(e) {
        e.preventDefault();
        var action = e.target;
        if (action && action.nodeName === 'BUTTON') {
          switch (action.dataset.action) {
            case 'leave':
              this.pubsub.publish(RPG.topics.PUB_GAME_LEAVE);
              if(isSpectatorMode){
              	isSpectatorMode =! isSpectatorMode;
              	dom.board.classList.add('blur');
				        dom.quitBtn.classList.add('hidden');
				        dom.menuContainer.classList.remove('move-top');
              }
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
      	isSpectatorMode = true;
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
      	var key = e.which;
        if (directionKeyCodes[key]) {
          e.preventDefault();
          this.pubsub.publish(directionKeyCodes[key].topic);
        }
        else {
        	if(e.target.id !== 'username' && key >= 48 && key <= 57){
        		this.actionManager.runAction(+String.fromCharCode(key));
        	}
        }
      }.bind(this));
    }
    /**
     * A helper function that subscribes to given a topic
     */
  GfxEventManager.prototype.s = function(topic, callback) {
    this.pubsub.subscribe(topic, callback.bind(this));
  }
  return GfxEventManager;
});