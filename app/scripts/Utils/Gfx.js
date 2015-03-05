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

    this.joystick = document.querySelector('#rpg-joystick');
    this.boardContainer = document.querySelector('#rpg-grid');
    this.buttons = document.querySelector('#action-buttons');
    this.upperButtons = document.querySelector('#upper-buttons');
    this.avatars = document.querySelector('#avatar-container');
    this.avatars.selected = this.avatars.querySelector('img.selected').src;
    this.username = document.querySelector('#username');
    [this.boardContainer, this.joystick, this.buttons, this.avatars, this.username, this.upperButtons].forEach(function(el) {
      if (el) {
        el.on = function(eventName, fn) {
          el.addEventListener(eventName, fn.bind(this), false);
        }.bind(this);
      }
    }.bind(this));
    this.build();
  };
  Gfx.prototype.build = function() {
    var grid = '<table>';
    for (var i = 0; i < this.gridSize; i += 1) {
      grid += '<tr>';
      for (var j = 0; j < this.gridSize; j += 1) {
        grid += '<td data-y="' + i + '" data-x="' + j + '">';
        grid += '&middot;';
        grid += '</td>';
      }
      grid += '</tr>';
    }
    this.boardContainer.innerHTML = grid;
    this.attachEvents();
  };
  Gfx.prototype.draw = function(obj) {
    var item = document.createElement('div');
    var life = '<span class="rpg-life"><i style="width:' + obj.life + '%;"></i></span>';
    var name = '<span class="rpg-name">' + obj.name + '</span>';
    var image = '<img src="' + obj.avatar + '" width="32px" height="32px"/>';
    item.classList.add('rpg-item');
    item.dataset.x = obj.x;
    item.dataset.y = obj.y;
    item.innerHTML = image + '<span>' + name + life + '</span>';
    item.addEventListener('click', this.itemSelected.bind(this), false);
    this.boardContainer.appendChild(item);
    return item;
  };
  Gfx.prototype.attachEvents = function() {
    this.boardContainer.on('click', function(e) {
      var cell = e.target;
      if (cell && cell.nodeName === 'TD') {
        cell.classList.toggle('rpg-selected');
        cell.classList.toggle('rpg-occupied');
        this.publish('/gfx/cell/click', {
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
          this.publish('/gfx/player/move', move.dataset.direction);
        }
      });
    }
    var btnQuit = document.querySelector('[data-action="leave"]');
    var menuContainer = document.querySelector('.menu');
    var board = document.querySelector('.jumbotron.blur');
    this.buttons.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'A') {
        switch (action.dataset.action) {
          case 'join':
          	btnQuit.classList.remove('hidden');
						menuContainer.classList.add('move-top');
						board.classList.remove('blur');
            this.publish(RPG.topics.PUB_PLAYER_JOIN, {
              name: this.username.value,
              avatar: this.avatars.selected
            });
            break;
        }
      }
    });
    this.upperButtons.on('click', function(e){
    	e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'BUTTON') {
        switch (action.dataset.action) {
          case 'leave':
          	btnQuit.classList.add('hidden');
						menuContainer.classList.remove('move-top');
						board.classList.add('blur');
            this.publish(RPG.topics.PUB_PLAYER_LEAVE);
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
      	this.avatars.selected = action.src;
      }
    });
    var btnJoin = this.buttons.querySelector('[data-action="join"]');
    this.username.on('keyup', function(e){
    	var value = e.target.value;
    	if(value === ''){
    		btnJoin.setAttribute('disabled', true);
    	}
    	else {
    		btnJoin.removeAttribute('disabled');
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
      this.publish(topic);
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
    this.publish('/gfx/item/selected', {
      x: +item.dataset.x,
      y: +item.dataset.y
    });
  };
  Gfx.prototype.place = function(obj) {
    var cell = this.boardContainer.querySelector('td[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
    cell.classList.add('rpg-occupied');
    var item = this.draw(obj);
    this.transposePosition(item, cell);
    this.publish('/gfx/item/placed', obj);
  };
  Gfx.prototype.transposePosition = function(item, cell) {
    item.style.top = cell.offsetTop + 15 + 'px';
    item.style.left = cell.offsetLeft + 15 + 'px';
  };
  Gfx.prototype.selectPlayer = function(p) {
    var container = document.querySelector('#rpg-selected-player');
    var life = '<span class="rpg-life"><i style="width:' + p.getLife() + '%;"></i></span>';
    var name = '<span class="rpg-name">' + p.getName() + '</span>';
    var image = '<img src="' + p.getAvatar() + '" width="32px" height="32px"/>';
    container.innerHTML = image + name + life;
  };
  Gfx.prototype.selectEnemy = function(p) {
    var container = document.querySelector('#rpg-selected-enemy');
    var life = '<span class="rpg-life"><i style="width:' + p.getLife() + '%;"></i></span>';
    var name = '<span class="rpg-name">' + p.getName() + '</span>';
    var image = '<img src="' + p.getAvatar() + '" width="32px" height="32px"/>';
    container.innerHTML = image + name + life;
  };
  Gfx.prototype.move = function(obj) {
    var o = {
      x: obj.x,
      y: obj.y
    };
    switch (obj.direction) {
      case 'up':
        o.y -= 1;
        break;
      case 'down':
        o.y += 1;
        break;
      case 'left':
        o.x -= 1;
        break;
      case 'right':
        o.x += 1;
        break;
    }
    if (this.isEmptyCell(o)) {
      this.translate(obj, o);
      this.publish('/gfx/item/moved', o);
      return o;
    } else {
      this.collide(obj);
      this.publish('/gfx/item/collide', o);
      return obj;
    }
  };
  Gfx.prototype.isEmptyCell = function(obj) {
    var cell = this.getItem(obj, 'td');
    return !this.isOut(obj) && !cell.classList.contains('rpg-occupied');
  };
  Gfx.prototype.isOut = function(obj) {
    return obj.x >= this.gridSize || obj.x < 0 || obj.y < 0 || obj.y >= this.gridSize;
  };
  Gfx.prototype.getFreeNeighbours = function(obj) {
    var cell = this.getItem(obj, 'td');
    return this.ai.getFreeNeighbours(cell.dataset);
  };
  Gfx.prototype.collide = function(obj) {
    var item = this.getItem(obj, 'div');
    item.classList.add('collide');
    setTimeout(function() {
      item.classList.remove('collide');
    }, 1000);
  };
  Gfx.prototype.translate = function(o1, o2) {
    var oldCell = this.getItem(o1, 'td');
    var newCell = this.getItem(o2, 'td');
    var item = this.getItem(o1, 'div');
    oldCell.classList.remove('rpg-occupied');
    newCell.classList.add('rpg-occupied');
    this.transposePosition(item, newCell);
    item.dataset.x = o2.x;
    item.dataset.y = o2.y;
  };
  Gfx.prototype.remove = function(obj) {
    var cell = this.boardContainer.querySelector('td[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
    cell.classList.remove('rpg-occupied');
    cell.innerHTML = '&middot;';
    this.publish('/gfx/item/removed', obj);
    return this;
  };
  Gfx.prototype.removePlayer = function(obj){
  	var item = document.querySelector('.rpg-item[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
  	if(item){
  		item.parentNode.removeChild(item);
  	}
  };
  Gfx.prototype.hit = function(amout) {
    this.selectedEnemy.hit(amout);
    var pos = this.selectedEnemy.getPosition();
    var life = this.selectedEnemy.getLife();
    this.gfx.update({
      x: pos.x,
      y: pos.y,
      life: life
    });
  };
  Gfx.prototype.getItem = function(obj, type) {
    type = type || '';
    return this.boardContainer.querySelector(type + '[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
  };
  Gfx.prototype.publish = function() {
    return this.pubsub.publish.apply(this, arguments);
  }
  Gfx.prototype.subscribe = function() {
    return pubsub.subscribe.apply(this, arguments);
  }
  return Gfx;
});