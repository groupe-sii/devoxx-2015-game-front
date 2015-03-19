/* jshint devel:true */
/* globals RPG */
/**
 * GfxEventManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxEventManager', function() {
  'use strict';
  var keyCodes = {
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

  function GfxEventManager(PubSub) {
    this.pubsub = PubSub;
  }
  GfxEventManager.prototype.initialize = function(dom) {
    this.bindTopics(dom);
    this.bindEvents(dom);
  };
  GfxEventManager.prototype.bindTopics = function(dom) {
    dom.debugBtn.on('change', function(e) {
    	var debug = e.target.checked;
      var entities = dom.findEntities();
      entities.forEach(function(entity) {
        entity.debug = debug;
      });
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_CREATED, function(topic, data) {
      dom.placeEntity(data);
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_LEFT_GAME, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.destroy();
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (!entity) {
        entity = dom.placeEntity(data);
      } else {
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
      if (entity) {
        entity.explode();
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_HIT, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.hit(data.amount);
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_GAME_LEAVE, function(topic) {
      var entity = dom.findEntity();
      if (entity) {
        entity.explode(true);
      }
    }.bind(this));
    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/close');
    }.bind(this))
  };
  GfxEventManager.prototype.bindEvents = function(dom) {
    dom.boardContainer.on('click', function(e) {
      var cell = e.target;
      if (cell && cell.nodeName === 'TD' && !cell.classList.contains('rpg-occupied')) {
        cell.classList.toggle('rpg-selected');
        cell.classList.toggle('rpg-obstacle');
      }
    });
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
      if (keyCodes[e.which]) {
        e.preventDefault();
        this.pubsub.publish(keyCodes[e.which].topic);
      }
    }.bind(this));
  }
  return GfxEventManager;
});