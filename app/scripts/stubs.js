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
    player: {
      "@c": "string",
      "id": "SimpleWizard-35",
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
      "id": "SimpleWizard-35",
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
  setInterval(function() {
    ps.publish(RPG.topics.SUB_PLAYER_HIT, hit);
  }, 2000);
  setTimeout(function() {
    ps.publish(RPG.topics.SUB_PLAYER_DIED, died);
  }, 10000);
});