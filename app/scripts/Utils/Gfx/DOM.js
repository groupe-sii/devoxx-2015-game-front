/* jshint devel:true */
/* globals RPG */
/**
 * GfxDom module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxDom', function() {
  'use strict';

  function GfxDom(GfxEventManager){
  	this.entityTag = 'rpg-entity';
  	this.eventManager = GfxEventManager;
  }
  GfxDom.prototype.initialize = function(){
  	var self = this;
  	var elements = {};
    elements.modal = document.querySelector('#modal');
    elements.container = document.querySelector('#container');
  	elements.quitBtn = document.querySelector('[data-action="leave"]');
    elements.menuContainer = document.querySelector('.menu');
    elements.board = document.querySelector('.jumbotron.blur');
  	elements.joystick = document.querySelector('#rpg-joystick');
    elements.boardContainer = document.querySelector('#rpg-grid');
    elements.joinBtn = document.querySelector('[data-action="join"]');
    elements.spectatorBtn = document.querySelector('[data-action="spectator"]');
    elements.upperButtons = document.querySelector('#upper-buttons');
    elements.avatars = document.querySelector('#avatar-container');
    elements.avatars.selected = elements.avatars.querySelector('.selected').dataset.name;
    elements.username = document.querySelector('#username');
    elements.debugBtn = document.querySelector('#debug');
    elements.connectionMsg = document.querySelector('#message');
    elements.actionsList = document.querySelector('#actions-list');
    
    function addEvent(currentElement){
      // closure FTW!!!!
      return function(eventName, fn) {
        currentElement.addEventListener(eventName, fn.bind(self.eventManager), false);
      };
    }

    for(var el in elements){
    	if(elements.hasOwnProperty(el) && elements[el]){
    		elements[el].on = addEvent(elements[el]);
    		self[el] = elements[el];
    	}
    }
  };
  GfxDom.prototype.build = function(info){
    var frag, table, tr, td, x, y;
    frag = document.createDocumentFragment();
    table = document.createElement('table');
    table.setAttribute('id', info.id);
    for (x = 0; x < info.board.height; x += 1) {
      tr = document.createElement('tr');
      tr.dataset.x = x;
      for (y = 0; y < info.board.width; y += 1) {
        td = document.createElement('td');
        td.dataset.x = y;
        td.dataset.y = x;
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    frag.appendChild(table);
    this.boardContainer.appendChild(frag.cloneNode(true));
  };
  GfxDom.prototype.drawActionsPanel = function(actionsList){
    var frag = document.createDocumentFragment();
    actionsList.forEach(function(actionObject, index){
      var span = document.createElement('span');
      ['btn', 'btn-lg', 'btn-extension-action'].forEach(function(cssClass){
        span.classList.add(cssClass);
      });
      span.dataset.index = index;
      span.setAttribute('title', actionObject.info.name+' is mapped to key: '+(index+1) );
      span.style.backgroundImage = 'url('+actionObject.info.icon+')';
      span.style.backgroundRepeat = 'no-repeat';
      frag.appendChild(span);
    }.bind(this));
    this.actionsList.appendChild(frag);
    this.actionsList.addEventListener('click', function(e){
      if(e.target.classList.contains('btn-extension-action')){
        actionsList[+e.target.dataset.index].action();
      }
    });
  };
  GfxDom.prototype.createEntity = function(obj, type) {
    var entity = document.createElement(this.entityTag);
    entity.setAttribute('id', obj.player.id);
    entity.setAttribute('type', type);
    entity.life = obj.player.life;
    entity.name = obj.player.playerInfo.name;
    entity.avatar = obj.player.playerInfo.avatar;
    entity.position = {
      current: obj.newCell,
      previous: obj.oldCell
    };
    entity.host = RPG.config.server.host;
    entity.addEventListener('click', function(e) {
      if(e.target.type !== 'animation'){
        this.selectEntity(e.target);
      }
    }.bind(this), false);
    return entity;
  };
  GfxDom.prototype.placeEntity = function(entity) {
    var entityClass = entity.player['@c'];
    var type = entityClass.startsWith('.SimpleWizard') ? 'player' : 'enemy';
    var isAnimationEntity = entityClass.startsWith('.SimpleAnimation');
    if(isAnimationEntity){
      type = 'animation';
    }

    if(entity.player.playerInfo.name === this.username.value){
      type = 'my-player';
    }

    entity = this.createEntity(entity, type);
    this.boardContainer.appendChild(entity);
    this.moveTo(entity);
    if(type === 'my-player'){
      this.selectPlayer(entity);
    }
    return entity;
  };
  GfxDom.prototype.placeAnimationNode = function(animation) {
    // 1) create an animation entity of type ".SimpleAnimation"
    // 2) register the animation
    // 3) play it
    // 4) kill it
    return this.placeEntity({
      player: {
        '@c': '.SimpleAnimation',
        id: 'animation-'+animation.name+'-'+animation.position.x+animation.position.y,
        life: {
          max: 0,
          current: 0
        },
        playerInfo: {
          name: animation.name,
          avatar: {
            '@c': '.ServerImage',
            content: ''
          }
        }
      },
      newCell: animation.position
    },'animation');

  };
  GfxDom.prototype.selectEntity = function(entity) {
    switch (entity.type) {
      case 'player':
        this.selectPlayer(entity);
        break;
      case 'enemy':
        this.selectEnemy(entity);
        break;
    }
    this.eventManager.pubsub.publish('/gfx/cell/selected', entity.position.current);
  };
  GfxDom.prototype.selectPlayer = function(player) {
    document.querySelector('#rpg-selected-player').setEntity(player);
  };
  GfxDom.prototype.selectEnemy = function(enemy) {
    document.querySelector('#rpg-selected-enemy').setEntity(enemy);
  };
  GfxDom.prototype.moveTo = function(entity) {
    var oldCell, newCell;
    entity = entity ||  this.playerEntity;
    if (entity) {
      oldCell = this.findCell(entity.position.previous);
      if (oldCell) {
        oldCell.classList.remove('rpg-occupied');
      }
      newCell = this.findCell(entity.position.current);
      if (newCell) {
        newCell.classList.add('rpg-occupied');
      }
      entity.style.top = (newCell.offsetTop + 17) + 'px';
      entity.style.left = (newCell.offsetLeft + 53) + 'px';
    }
  };
  GfxDom.prototype.findEntity = function(id){
    if(typeof id === 'string'){
      return this.boardContainer.querySelector('#'+id);
    }
    return this.boardContainer.querySelector('rpg-entity[type="my-player"]');
  };
  GfxDom.prototype.findEntities = function() {
    return [].slice.call(this.boardContainer.querySelectorAll('rpg-entity'));
  };
  GfxDom.prototype.findCell = function(position){
    if(position){
      return this.boardContainer.querySelector('td[data-x="' + position.x + '"][data-y="' + position.y + '"]');
    }
  };
  GfxDom.prototype.generateRandomPosition = function() {
    return {
      x: ((Math.random() * RPG.game.board.width) | 0),
      y: ((Math.random() * RPG.game.board.height) | 0)
    };
  };
  GfxDom.prototype.remove = function(obj) {
    var cell =  this.findCell(obj);
    if(cell){
      cell.classList.remove('rpg-occupied');
      cell.innerHTML = '';
      this.pubsub.publish('/gfx/item/removed', obj);
    }
    return this;
  };
  GfxDom.prototype.showMessage = function(msg, hide){
    if(hide){
      this.container.classList.remove('blur');
      this.connectionMsg.classList.add('hidden');
      this.modal.classList.add('hidden');
      this.connectionMsg.innerHTML = '';
    }
    else {
      this.container.classList.add('blur');
      this.connectionMsg.classList.remove('hidden');
      this.modal.classList.remove('show');
      this.connectionMsg.innerHTML = msg;
    }
  };
  GfxDom.prototype.createStyleTag = function(id, css) {
    var styleContainer = document.createElement('div');
    styleContainer.id = id;
    styleContainer.innerHTML = '<style>'+css+'</style>';
    document.querySelector('body').appendChild(styleContainer);
  };

  GfxDom.prototype.addImage = function(image, cell) {
    var img = document.createElement('img');
    var src = image.uri || ('data:'+image.mimetype+';base64,'+image.content);
    // this is needed to reset gif animation
    src += '?'+new Date().getTime();
    img.setAttribute('src', src);
    img.setAttribute('id', image.id+cell.x+cell.y);
    img.classList.add("game-image");
    var boardCell = this.findCell(cell);
    img.style.position = 'absolute';
    img.style.top = (boardCell.offsetTop + 0) + 'px';
    img.style.left = (boardCell.offsetLeft + 40) + 'px';
    this.boardContainer.appendChild(img);
  };

  GfxDom.prototype.moveImage = function(image, start, end) {
    var img = this.boardContainer.querySelector('#'+image.id+start.x+start.y);
    var endCell = this.findCell(end);
    // move will be done by css animation
    img.style.top = (endCell.offsetTop + 0) + 'px';
    img.style.left = (endCell.offsetLeft + 40) + 'px';
  };

  GfxDom.prototype.removeImage = function(image, cell) {
    var img = this.boardContainer.querySelector('#'+image.id+cell.x+cell.y);
    this.boardContainer.removeChild(img);
  };

  return GfxDom;

});
