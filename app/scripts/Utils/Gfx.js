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
    this.itemElement = 'rpg-entity';
    this.playerEntity = null;

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
  }
  Gfx.prototype.loop = function() {

    this.pubsub.subscribe('/gfx/cell/click', function( /*topic, data*/ ) {});
    this.pubsub.subscribe('/gfx/item/place', function() {});
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_JOINED, function(topic, data) {
      this.playerEntity = this.placeEntity(data, 'player');
      
    //   debugger;
    //   var enemy = null;
    //   var nbEnemy = 5;
    //   for (var i = nbEnemy - 1; i >= 0; i--) {
    //     enemy = this.createEntity({
    //       life: (Math.random() * 100),
    //       position: generatePosition_(this.gridSize)
    //     }, 'enemy');
    //     this.placeEntity(enemy);
      // };
      
    }.bind(this));
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_LEFT, function(topic, data) {
      this.removePlayer(data.oldCell);
    }.bind(this));
    
    this.pubsub.subscribe(RPG.topics.SUB_OTHER_JOINED, function(topic, data) {});
    
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_MOVED, function(topic, data) {
      var entity = this.playerEntity.setEntity(data);
      this.moveTo(entity);
    }.bind(this));

    window.addEventListener('beforeunload', function() {
      this.pubsub.publish('/transport/close');
    }.bind(this));

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
  Gfx.prototype.attachEvents = function() {
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
    this.buttons.on('click', function(e) {
      e.preventDefault();
      var action = e.target;
      if (action && action.nodeName === 'A') {
        switch (action.dataset.action) {
          case 'join':
            this.pubsub.publish(RPG.topics.PUB_PLAYER_JOIN, {
              name: this.username.value,
              avatar: this.avatars.selected
            });
            break;
        }
      }
    });
    var menuContainer = document.querySelector('.menu');
    var board = document.querySelector('.jumbotron.blur');
    var btnQuit = document.querySelector('[data-action="leave"]');
    this.pubsub.subscribe(RPG.topics.SUB_PLAYER_JOINED, function() {
      board.classList.remove('blur');
    	btnQuit.classList.remove('hidden');
		  menuContainer.classList.add('move-top');
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
    var entity = document.createElement(this.itemElement);
    entity.setAttribute('type', type);
    entity.setEntity(obj);
    entity.addEventListener('click', function(e){
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
  // Gfx.prototype.transposePosition = function(item, cell) {
  //   if(item){
  //     item.transpose({
  //       top: cell.offsetTop,
  //       left: cell.offsetLeft
  //     });
  //   }
  // };
  Gfx.prototype.selectEntity = function(entity){
    switch(entity.type){
      case 'player': 
        this.selectPlayer(entity);
        break;
      case 'enemy':
        this.selectedEnemy(entity);
        break;
    }
  };
  Gfx.prototype.selectPlayer = function(player) {
    var container, life, name, avatar;
    if(player){
      container = document.querySelector('#rpg-selected-player');
      life = '<span class="rpg-life"><i style="width:' + player.life + '%;"></i></span>';
      name = '<span class="rpg-name">' + player.name + '</span>';
      avatar = '<img src="' + player.avatar + '" width="32px" height="32px"/>';
      container.innerHTML = avatar + name + life;
    }
  };
  Gfx.prototype.selectEnemy = function(enemy) {
    var container = document.querySelector('#rpg-selected-enemy');
    var life = '<span class="rpg-life"><i style="width:' + enemy.getLife() + '%;"></i></span>';
    var name = '<span class="rpg-name">' + enemy.getName() + '</span>';
    var image = '<img src="' + enemy.getAvatar() + '" width="32px" height="32px"/>';
    container.innerHTML = image + name + life;
  };
  Gfx.prototype.moveTo = function(entity){

    // var entity = this.boardContainer.querySelector(this.itemElement+'[data-x="' + data.position.current.x + '"][data-y="' + data.position.current.y + '"]');
    var oldCell, newCell;

    if(entity){

      oldCell = this.boardContainer.querySelector('td[data-x="' + entity.position.previous.x + '"][data-y="' + entity.position.previous.y + '"]');
      if(oldCell){
        oldCell.classList.remove('rpg-occupied');
      }
      
      newCell = this.boardContainer.querySelector('td[data-x="' + entity.position.current.x + '"][data-y="' + entity.position.current.y + '"]');
      if(newCell){
        newCell.classList.add('rpg-occupied');
      }      

      entity.moveTo({
        // location: newCell.getBoundingClientRect(),
        // location: newCell.getClientRects()[0],
        location: {
          top: newCell.offsetTop,
          left: newCell.offsetLeft
        },
        position: entity.position
      });

    }

  };
  // Gfx.prototype.isEmptyCell = function(obj) {
  //   var cell = this.getItem(obj, 'td');
  //   return !this.isOut(obj) && !cell.classList.contains('rpg-occupied');
  // };
  // Gfx.prototype.isOut = function(obj) {
  //   return obj.x >= this.gridSize || obj.x < 0 || obj.y < 0 || obj.y >= this.gridSize;
  // };
  // Gfx.prototype.getFreeNeighbours = function(obj) {
  //   var cell = this.getItem(obj, 'td');
  //   return this.ai.getFreeNeighbours(cell.dataset);
  // };
  // Gfx.prototype.translate = function(o1, o2) {
  //   var oldCell = this.getItem(o1, 'td');
  //   var newCell = this.getItem(o2, 'td');
  //   var item = this.getPlayer(o1);

  //   if(item){
  //     oldCell.classList.remove('rpg-occupied');
  //     newCell.classList.add('rpg-occupied');
  //     this.transposePosition(item, newCell);
  //     item.set({
  //       position: o2
  //     });
  //   }
  // };
  Gfx.prototype.remove = function(obj) {
    var cell = this.boardContainer.querySelector('td[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
    cell.classList.remove('rpg-occupied');
    cell.innerHTML = '&middot;';
    this.pubsub.publish('/gfx/item/removed', obj);
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
    this.update({
      x: pos.x,
      y: pos.y,
      life: life
    });
  };
  // Gfx.prototype.getItem = function(obj, type) {
  //   type = type || '';
  //   return this.boardContainer.querySelector(type + '[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
  // };
  // Gfx.prototype.getPlayer = function(obj) {
  //   return this.boardContainer.querySelector(this.itemElement+'[data-x="' + obj.x + '"][data-y="' + obj.y + '"]');
  // };
  // Gfx.prototype.publish = function() {
  //   return this.pubsub.publish.apply(this, arguments);
  // };
  // Gfx.prototype.subscribe = function() {
  //   return this.pubsub.subscribe.apply(this, arguments);
  // };
  return Gfx;

});