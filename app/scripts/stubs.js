/* jshint devel:true */
/* globals RPG */
/**
 * The main game loop
 * @type {Function}
 * @author Wassim Chegham
 */
RPG.run(function() {
  'use strict';
  var ps = RPG.Factory.pubsub();
  var died = {
    "player": {
      "@c": "string",
      "id": null,
      "life": {
        "current": 0,
        "max": 0
      },
      "playerInfo": {
        "name": "string",
        "avatar": "string"
      },
      "states": "string"
    }
  };
  var hit = {
    "player": {
      "@c": "string",
      "id": null,
      "life": {
        "current": 700,
        "max": 0
      },
      "playerInfo": {
        "name": "string",
        "avatar": "string"
      },
      "states": "string"
    },
    "amount": 100
  };
  document.querySelector('#debug').addEventListener('change', function(e){
  	if(this.checked){
      document.querySelector('.debug-buttons').removeAttribute('hidden');
    } else {
      document.querySelector('.debug-buttons').setAttribute('hidden', true);
  	}
  });
  document.querySelector('a[data-action="hit"]').addEventListener('click', function(e){
    e.preventDefault();
    ps.publish(RPG.topics.SUB_PLAYER_HIT, hit);
  });
  document.querySelector('a[data-action="heal"]').addEventListener('click', function(e){
  	e.preventDefault();
    ps.publish(RPG.topics.SUB_PLAYER_HEALED, hit);
  });
  document.querySelector('a[data-action="kill"]').addEventListener('click', function(e){
  	e.preventDefault();
    ps.publish(RPG.topics.SUB_PLAYER_DIED, died.player);
  });
  document.querySelector('a[data-action="revive"]').addEventListener('click', function(e){
  	e.preventDefault();
    ps.publish(RPG.topics.SUB_PLAYER_REVIVED, hit.player);
  });

});