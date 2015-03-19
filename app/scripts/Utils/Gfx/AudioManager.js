/* jshint devel:true */
/* globals RPG */
/**
 * AudioManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('AudioManager', function() {
  'use strict';

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var context = new AudioContext();
  var fxBuffer = {};

  function AudioManager(PubSub){
  	this.pubsub = PubSub;
  }

  AudioManager.prototype.enable = function(){
  	this.initialize();
  	this.subscribeToTopics();
  };
  AudioManager.prototype.initialize = function(){
  	[
	  	['bg', 'fx/Battle_Pirate_Theme_Music_1.mp3', true, true, 0.5],
		  ['explosion', 'fx/Explosion.wav', false, false, 0.2],
		  ['jump-1', 'fx/Jump-1.wav', false, false, 0.2],
		  ['jump-3', 'fx/Jump-3.wav', false, false, 0.2],
		  ['jump-2', 'fx/Jump-2.wav', false, false, 0.2],
		  ['jump-4', 'fx/Jump-4.wav', false, false, 0.2],
		  ['gameOver', 'fx/Game_Over.mp3', false, false, 0.2]
	  ].forEach(function(config, index){
	  	this.loadFx.apply(this, config);
	  }.bind(this));
  };
  AudioManager.prototype.subscribeToTopics = function(){
  	var self = this;
  	var config = {};
  	config[RPG.topics.SUB_ME_GAME_CREATED] = ['bg', true];
  	config[RPG.topics.SUB_ME_JOINED_GAME] = ['jump-1', false, 1];
  	config[RPG.topics.SUB_PLAYER_HIT] = ['jump-2', false, 1];
  	config[RPG.topics.SUB_PLAYER_HIT] = ['jump-2', false, 1];

  	// WARNING: dont play a sound on players moves, there are too many moves!!!
  	// config[RPG.topics.SUB_PLAYER_MOVED] = ['jump-3', false, 0.2];

  	for(var topic in config){
  		this.pubsub.subscribe(topic, function() {
		    config[topic].forEach(function(fx){
		    	self.playSound(fx);
		    })
		  });
  	}
  };
  AudioManager.prototype.loadFx = function(key, fx, autoPlay, loop, gain) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', fx, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        fxBuffer[key] = buffer;
        autoPlay && self.playSound(key, loop, gain);
      }, function() {});
    };
    request.send();
  };
  AudioManager.prototype.playSound = function(fx, loop, gain) {
    var buffer = fxBuffer[fx];
    if (buffer) {
      var source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = loop || false;
      var volumeNode = context.createGain();
      volumeNode.gain.value = gain || 0.5;
      volumeNode.connect(context.destination);
      source.connect(volumeNode);
      source.start(context.currentTime);
    }
  };
  AudioManager.prototype.stopSound = function(fx) {
    var buffer = fxBuffer[fx];
    if (buffer) {
      var source = context.createBufferSource();
      source.stop(context.currentTime);
    }
  };

  return AudioManager;
});