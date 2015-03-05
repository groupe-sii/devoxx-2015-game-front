/* jshint devel:true */
/* globals RPG */
/**
 * Config file.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.config({

	'socket': {
		'url': 'http://localhost:8080/game'
	},
  
	/**
	 * Topics list mapping
	 * @type {Object}
	 */
  'topics': {
    'PUB_PLAYER_JOIN': '/topic/game/player/join',
    'PUB_PLAYER_LEAVE': '/topic/game/player/quit',
    'SUB_PLAYER_DIED': '/topic/game/player/died',
    'SUB_PLAYER_REVIVED': '/topic/game/player/revived',
    'SUB_PLAYER_HIT': '/topic/game/player/hit',
    'SUB_PLAYER_HEALED': '/topic/game/player/healed',
    'SUB_PLAYER_STATES': '/topic/game/player/states',
    'SUB_PLAYER_LIFE': '/topic/game/player/max',
    'PUB_PLAYER_MOVE_UP': '/topic/game/player/move/up',
    'PUB_PLAYER_MOVE_DOWN': '/topic/game/player/move/down',
    'PUB_PLAYER_MOVE_LEFT': '/topic/game/player/move/left',
    'PUB_PLAYER_MOVE_RIGHT': '/topic/game/player/move/right',
    'PUB_ACTION': '/topic/game/action',
    'SUB_ACTION_IMAGE_MOVED': '/topic/game/action/image/moved',
    'SUB_PLAYER_MOVED': '/topic/game/board/moved',
    'SUB_PLAYER_JOINED': '/topic/game/board/added',
    'SUB_PLAYER_LEFT': '/topic/game/board/removed',
    'SUB_ERROR_GLOBAL': '/topic/game/message/error',
    'SUB_MESSAGE_GLOBAL': '/topic/game/message',
    'SUB_ERROR_LOCAL': '/queue/errors'
  }
});