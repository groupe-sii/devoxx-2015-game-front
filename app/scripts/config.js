/* jshint devel:true */
/* globals RPG */
/**
 * Config file.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.config({
  'audio': false,
  'server': {
    'host': 'http://localhost:8080'
  },
  'socket': {
    // 'url': 'http://10.6.192.222:8080/survival-game/game'
    // 'url': 'http://192.168.1.17:8080/survival-game/game'
    'url': 'http://localhost:8080/game'
    // 'url': 'http://10.6.192.98:8080/game'
  },
  /**
   * Topics list mapping
   * @type {Object}
   */
  'topics': {
    'PUB_GAME_CREATE': '/topic/game/create',
    'PUB_GAME_SELECT': '/topic/game/select',
    'PUB_GAME_INFO': '/topic/game/info',
    'PUB_GAME_JOIN': '/topic/game/{gameId}/join',
    'PUB_GAME_LEAVE': '/topic/game/{gameId}/leave',

    'SUB_PLAYER_DIED': '/topic/game/{gameId}/player/died',
    'SUB_PLAYER_REVIVED': '/topic/game/{gameId}/player/revived',
    'SUB_PLAYER_HIT': '/topic/game/{gameId}/player/hit',
    'SUB_PLAYER_HEALED': '/topic/game/{gameId}/player/healed',
    'SUB_PLAYER_STATES': '/topic/game/{gameId}/player/states',
    'SUB_PLAYER_LIFE_LEVEL': '/topic/game/{gameId}/player/max',
    'SUB_PLAYER_MOVED': '/topic/game/{gameId}/player/moved',
    'SUB_PLAYER_LEFT_GAME': '/topic/game/{gameId}/player/left',
    'SUB_PLAYER_DESTROYED': '/topic/game/{gameId}/player/removed',
    'SUB_PLAYER_JOINED_GAME': '/topic/game/{gameId}/player/joined',
    'SUB_PLAYER_CREATED': '/topic/game/{gameId}/player/added',
    'SUB_ME_LEFT_GAME': '/user/topic/game/left',
    'SUB_ME_JOINED_GAME': '/user/topic/game/joined',

    'PUB_PLAYER_MOVE_UP': '/topic/game/player/move/up',
    'PUB_PLAYER_MOVE_DOWN': '/topic/game/player/move/down',
    'PUB_PLAYER_MOVE_LEFT': '/topic/game/player/move/left',
    'PUB_PLAYER_MOVE_RIGHT': '/topic/game/player/move/right',
    'PUB_GAME_ACTION': '/topic/game/action',

    'SUB_ME_GAME_SELECTED': '/user/topic/game/selected',
    'SUB_ME_GAME_CREATED': '/user/topic/game/created',
    'SUB_ACTION_IMAGE_MOVED': '/topic/game/{gameId}/action/image/moved',
    'SUB_ERROR_GLOBAL': '/topic/game/message/error',
    'SUB_MESSAGE_GLOBAL': '/topic/game/message',
    'SUB_ME_ERROR_LOCAL': '/user/queue/errors',

    'SUB_ANIMATION_ALL': '/user/topic/game/animation/all',
    'PUB_ANIMATION_ALL': '/topic/game/animation/all'

  }
});