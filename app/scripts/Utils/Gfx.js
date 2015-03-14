/* jshint devel:true */
/* globals RPG */
/**
 * GFX module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Gfx', function() {
  'use strict';

  function Gfx(AI, PubSub) {
    this.pubsub = PubSub;
    this.ai = AI;
    this.name = 'Gfx';
    this.gridSize = 10;
    this.entityTag = 'rpg-entity';
    this.playerEntity = null;
    this.joystick = document.querySelector('#rpg-joystick');
    this.boardContainer = document.querySelector('#rpg-grid');
    this.joinBtn = document.querySelector('[data-action="join"]');
    this.spectatorBtn = document.querySelector('[data-action="spectator"]');
    this.upperButtons = document.querySelector('#upper-buttons');
    this.avatars = document.querySelector('#avatar-container');
    this.avatars.selected = this.avatars.querySelector('img.selected').dataset.name;
    this.username = document.querySelector('#username');
    [
      this.boardContainer, 
      this.joystick, 
      this.joinBtn, 
      this.spectatorBtn, 
      this.avatars, 
      this.username, 
      this.upperButtons
    ].forEach(function(el) {
      if (el) {
        el.on = function(eventName, fn) {
          el.addEventListener(eventName, fn.bind(this), false);
        }.bind(this);
      }
    }.bind(this));
    this.build();
  }
  Gfx.prototype.loop = function() {
    this.pubsub.subscribe('/gfx/cell/click', function( /*topic, data*/ ) {});
    this.pubsub.subscribe('/gfx/item/place', function() {});
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_JOINED, function(topic, data) {
      this.playerEntity = this.placeEntity(data, 'player');
      
      var enemy = null;
      var nbEnemy = 5;
      for (var i = nbEnemy - 1; i >= 0; i--) {
        //@todo create enemies accordingly to server
        enemy = this.placeEntity({
          player: {
            playerInfo: {
              avatar: 'dvl1_fr1',
              name: 'Enemy ' + i
            },
            life: {
              current: (Math.random() * 100)|0,
              max: 100
            }
          },
          newCell: this.generateRandomPosition()
        }, 'enemy');
      };

      this.selectPlayer(this.playerEntity);

    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_LEFT, function(topic, data) {
      if(this.playerEntity){
        this.playerEntity.destroy();
      }
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_OTHER_JOINED, function(topic, data) {});
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      this.playerEntity.setAttribute('current-position-x', data.newCell.x);
      this.playerEntity.setAttribute('current-position-y', data.newCell.y);
      this.playerEntity.setAttribute('previous-position-x', data.oldCell.x);
      this.playerEntity.setAttribute('previous-position-y', data.oldCell.y);
      this.moveTo();
    }.bind(this));
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_DIED, function(topic, data) {
      if(this.playerEntity){
        this.playerEntity.explode();
      }
    }.bind(this));
    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/close');
    }.bind(this));
  };
  Gfx.prototype.generateRandomPosition = function() {
    return {
      x: ((Math.random() * this.gridSize) | 0),
      y: ((Math.random() * this.gridSize) | 0)
    };
  };
  Gfx.prototype.build = function() {
    var grid = '<table>';
    for (var i = 0; i < this.gridSize; i += 1) {
      grid += '<tr>';
      for (var j = 0; j < this.gridSize; j += 1) {
        grid += '<td data-y="' + i + '" data-x="' + j + '">';
        grid += '';
        grid += '</td>';
      }
      grid += '</tr>';
    }
    this.boardContainer.innerHTML = grid;
    this.attachEvents();
  };
  Gfx.prototype.attachEvents = function() {
    var quitBtn = document.querySelector('[data-action="leave"]');
    var menuContainer = document.querySelector('.menu');
    var board = document.querySelector('.jumbotron.blur');

    this.boardContainer.on('click', function(e) {
      var cell = e.target;
      if (cell && cell.nodeName === 'TD' && !cell.classList.contains('rpg-occupied')) {
        cell.classList.toggle('rpg-selected');
        cell.classList.toggle('rpg-occupied');
        this.pubsub.publish('/gfx/cell/click', {
          x: cell.dataset.x,
          y: cell.dataset.y
        });
      }
    });
    if (this.joystick) {
      this.joystick.on('click', function(e) {
        e.preventDefault();
        var move = e.target;
        if (move && move.nodeName === 'A') {
          this.pubsub.publish('/gfx/player/move', move.dataset.direction);
        }
      });
    }
    this.joinBtn.on('click', function(e) {
      this.pubsub.publish(RPG.topics.PUB_PLAYER_JOIN, {
        name: this.username.value,
        avatar: this.avatars.selected
      });
    });
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_JOINED, function() {
      board.classList.remove('blur');
      quitBtn.classList.remove('hidden');
      menuContainer.classList.add('move-top');
    });
    this.upperButtons.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'BUTTON') {
        switch (action.dataset.action) {
          case 'leave':
            quitBtn.classList.add('hidden');
            menuContainer.classList.remove('move-top');
            board.classList.add('blur');
            this.pubsub.publish(RPG.topics.PUB_PLAYER_LEAVE);
            break;
        }
      }
    });
    this.avatars.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'IMG') {
        action.parentElement.querySelector('.selected').classList.remove('selected');
        action.classList.add('selected');
        this.avatars.selected = action.dataset.name;
      }
    });
    this.spectatorBtn.on('click', function(e) {
      board.classList.remove('blur');
      quitBtn.classList.remove('hidden');
      menuContainer.classList.add('move-top');
    });
    this.username.on('keyup', function(e) {
      var value = e.target.value;
      if (value === '') {
        this.joinBtn.setAttribute('disabled', true);
      } else {
        this.joinBtn.removeAttribute('disabled');
        this.username.value = value;
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
  };
  Gfx.prototype.itemSelected = function(e) {
    var item = e.target.parentElement;
    var previousSelection = document.querySelector('.rpg-item.selected');
    if (previousSelection) {
      previousSelection.classList.remove('selected');
    }
    item.classList.add('selected');
    this.pubsub.publish('/gfx/item/selected', {
      x: +item.dataset.x,
      y: +item.dataset.y
    });
  };
  Gfx.prototype.createEntity = function(obj, type) {
    var entity = document.createElement(this.entityTag);
    entity.setAttribute('type', type);
    entity.setAttribute('life', obj.player.life.current);
    entity.setAttribute('name', obj.player.playerInfo.name);
    entity.setAttribute('avatar', obj.player.playerInfo.avatar);
    entity.setAttribute('current-position-x', obj.newCell.x);
    entity.setAttribute('current-position-y', obj.newCell.y);
    entity.setAttribute('previous-position-x', (obj.oldCell && obj.oldCell.x) || 0);
    entity.setAttribute('previous-position-y', (obj.oldCell && obj.oldCell.y) || 0);
    entity.addEventListener('click', function(e) {
      this.selectEntity(e.target);
    }.bind(this), false);
    return entity;
  };
  Gfx.prototype.placeEntity = function(entity, type) {
    var entity = this.createEntity(entity, type);
    this.boardContainer.appendChild(entity);
    this.moveTo(entity);
    this.pubsub.publish('/gfx/item/placed', entity);
    return entity;
  };
  Gfx.prototype.selectEntity = function(entity) {
    switch (entity.type) {
      case 'player':
        this.selectPlayer(entity);
        break;
      case 'enemy':
        this.selectEnemy(entity);
        break;
    }
  };
  Gfx.prototype.selectPlayer = function(player) {
    document.querySelector('#rpg-selected-player').setEntity(player);
  };
  Gfx.prototype.selectEnemy = function(enemy) {
    document.querySelector('#rpg-selected-enemy').setEntity(enemy);
  };
  Gfx.prototype.moveTo = function(entity) {
    var oldCell, newCell;
    entity = entity ||  this.playerEntity;
    if (entity) {
      oldCell = this.findCell({
        x: entity.getAttribute('previous-position-x'),
        y: entity.getAttribute('previous-position-y')
      });
      if (oldCell) {
        oldCell.classList.remove('rpg-occupied');
      }
      newCell = this.findCell({
        x: entity.getAttribute('current-position-x'),
        y: entity.getAttribute('current-position-y')
      });
      if (newCell) {
        newCell.classList.add('rpg-occupied');
      }
      entity.style.top = (newCell.offsetTop + 17) + 'px';
      entity.style.left = (newCell.offsetLeft + 53) + 'px';
    }
  };
  Gfx.prototype.remove = function(obj) {
    var cell =  this.findCell(obj);
    cell.classList.remove('rpg-occupied');
    cell.innerHTML = '';
    this.pubsub.publish('/gfx/item/removed', obj);
    return this;
  };
  Gfx.prototype.findEntity = function(position){
    return this.boardContainer.querySelector(this.entityTag+'[data-x="' + position.x + '"][data-y="' + position.y + '"]');
  };
  Gfx.prototype.findCell = function(position){
    return this.boardContainer.querySelector('td[data-x="' + position.x + '"][data-y="' + position.y + '"]');
  };
  return Gfx;
});