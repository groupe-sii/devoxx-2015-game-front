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
      topic: RPG.config.topics.PUB_PLAYER_MOVE_LEFT
    },
    38: {
      key: 'up',
      topic: RPG.config.topics.PUB_PLAYER_MOVE_UP
    },
    39: {
      key: 'right',
      topic: RPG.config.topics.PUB_PLAYER_MOVE_RIGHT
    },
    40: {
      key: 'down',
      topic: RPG.config.topics.PUB_PLAYER_MOVE_DOWN
    }
  };

  function selectCell(dom, position) {
    return dom.placeAnimationNode({
      position: position,
      name: 'selecting-cell'
    });
  }

  function GfxEventManager(PubSub, ActionManager, AudioManager) {
    this.actionManager = ActionManager;
    this.audioManager = AudioManager;
    this.pubsub = PubSub;
  }
  GfxEventManager.prototype.initialize = function(dom) {
    this.bindTopics(dom);
    this.bindDomEvents(dom);
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
    this.s(RPG.config.topics.SUB_PLAYER_STATES, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        if (data.changes && data.changes.length > 0) {
          data.changes.forEach(function(change) {
            var state = change.state.toLowerCase();
            entity[change.change === 'ADD' ? 'addState' : 'removeState'](state);
          });
        }
      }
    });
    this.s(RPG.config.topics.SUB_ME_GAME_SELECTED, function(topic, data) {
      dom.build(data);
    });
    this.s(RPG.config.topics.SUB_PLAYER_CREATED, function(topic, data) {
      dom.placeEntity(data);
    });
    this.s(RPG.config.topics.SUB_PLAYER_LIFE_LEVEL, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.life = data.player.life;
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_LEFT_GAME, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.destroy();
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_MOVED, function(topic, data) {
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
    this.s(RPG.config.topics.SUB_PLAYER_DIED, function(topic, data) {
      var entity = dom.findEntity(data.id);
      if (entity) {
        entity.explode().setDead();
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_REVIVED, function(topic, data) {
      var entity = dom.findEntity(data.id);
      if (entity) {
        entity.revive(data);
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_HIT, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.hit(data.amount);
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_HEALED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.heal(data.amount);
      }
    });
    this.s(RPG.config.topics.PUB_GAME_LEAVE, function() {
      var entity = dom.findEntity();
      if (entity) {
        entity.explode(true);
      }
    });
    this.s(RPG.config.topics.SUB_PLAYER_DESTROYED, function(topic, data) {
      var entity = dom.findEntity(data.player.id);
      if (entity) {
        entity.explode(true);
      }
    });
    this.s(RPG.config.topics.SUB_ME_JOINED_GAME, function() {
      dom.board.classList.remove('blur');
      dom.quitBtn.classList.remove('hidden');
      dom.menuContainer.classList.add('move-top');
    });
    this.s(RPG.config.topics.SUB_ME_LEFT_GAME, function() {
      dom.quitBtn.classList.add('hidden');
      dom.menuContainer.classList.remove('move-top');
      dom.board.classList.add('blur');
      dom.selectPlayer(null);
    });
    this.s(RPG.config.topics.SUB_ACTION_IMAGE_ADDED, function(topic, data) {
      dom.addImage(data.image, data.cell);
    });
    this.s(RPG.config.topics.SUB_ACTION_IMAGE_MOVED, function(topic, data) {
      dom.moveImage(data.image, data.start, data.end);
    });
    this.s(RPG.config.topics.SUB_ACTION_IMAGE_REMOVED, function(topic, data) {
      dom.removeImage(data.image, data.cell);
    });
    this.s('/transport/connecting', function() {
      dom.showMessage('Connecting to server...');
    });
    this.s('/transport/connected', function() {
      dom.showMessage(null, true);
    });
    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/connecting');
    }.bind(this));
  };
  GfxEventManager.prototype.bindDomEvents = function(dom) {
    dom.boardContainer.on('click', function(e) {
      var animation;
      var cell = e.target;
      var position = {};
      if (cell && cell.nodeName === 'TD' && !cell.classList.contains('rpg-occupied')) {
        cell.classList.toggle('rpg-selected');
        position = {
          x: +cell.dataset.x,
          y: +cell.dataset.y
        };
        animation = selectCell(dom, position);
        animation.addAnimation(animation.name).play(animation.name, function() {
          animation.destroy();
          cell.classList.toggle('rpg-selected');
          cell.classList.toggle('rpg-occupied');
        });
        this.pubsub.publish('/gfx/cell/selected', position);
      }
    }.bind(this));
    dom.joinBtn.on('click', function(e) {
      e.preventDefault();
      this.pubsub.publish(RPG.config.topics.PUB_GAME_JOIN, {
        name: dom.username.value,
        avatar: {
          '@c': '.ClientImage',
          name: dom.avatars.selected
        }
      });
    });
    dom.upperButtons.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'BUTTON') {
        switch (action.dataset.action) {
          case 'leave':
            this.pubsub.publish(RPG.config.topics.PUB_GAME_LEAVE);
            if (isSpectatorMode) {
              isSpectatorMode = !isSpectatorMode;
              dom.board.classList.add('blur');
              dom.quitBtn.classList.add('hidden');
              dom.menuContainer.classList.remove('move-top');
            }
            break;
          case 'fx':
            this.audioManager.toggleFx();
            break;
          case 'audio':
            this.audioManager.toggleAudio();
            break;
        }
      }
    });
    dom.avatars.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.classList.contains('avatar')) {
        action.parentElement.querySelector('.selected').classList.remove('selected');
        action.classList.add('selected');
        dom.avatars.selected = action.dataset.name;
      }
    });
    // dom.spectatorBtn.on('click', function() {
    //   isSpectatorMode = true;
    //   dom.board.classList.remove('blur');
    //   dom.quitBtn.classList.remove('hidden');
    //   dom.menuContainer.classList.add('move-top');
    // });
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
      } else {
        if (e.target.id !== 'username' && key >= 48 && key <= 57) {
          this.actionManager.runAction(+String.fromCharCode(key));
        }
      }
    }.bind(this));
  };
  /**
   * A helper function that subscribes to a given topic
   */
  GfxEventManager.prototype.s = function(topic, callback) {
    this.pubsub.subscribe(topic, callback.bind(this));
  };
  return GfxEventManager;
});
