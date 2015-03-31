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
  var fxSource = {};
  var topics = {};
  // WARNING: dont play a sound on players moves (RPG.config.topics.SUB_PLAYER_MOVED)
  // there will be too many of them!!!
  topics[RPG.config.topics.SUB_ME_GAME_CREATED] = ['background-001', true];
  topics[RPG.config.topics.SUB_ME_JOINED_GAME] = ['fx-006', false, 1];
  topics[RPG.config.topics.SUB_PLAYER_HIT] = ['fx-008', false, 1];
  topics[RPG.config.topics.SUB_PLAYER_DIED] = ['fx-001', false, 1];
  topics[RPG.config.topics.SUB_PLAYER_HEALED] = ['fx-008', false, 1];
  topics[RPG.config.topics.PUB_GAME_ACTION] = ['fx-009', false, 1];

  function AudioManager(PubSub){
  	this.pubsub = PubSub;
  }
  AudioManager.prototype.initialize = function(){
    // configure and load fx files
  	[
	  	['background-001', 'fx/Battle_Pirate_Theme_Music_1.mp3', true, true, 0.5],
		  ['fx-001', 'fx/Explosion.wav', false, false, 0.2],
		  ['fx-002', 'fx/Collide.wav', false, false, 0.2],
		  ['fx-003', 'fx/Game_Over.mp3', false, false, 0.2],
		  ['fx-004', 'fx/Jump-1.wav', false, false, 0.2],
		  ['fx-005', 'fx/Jump-3.wav', false, false, 0.2],
		  ['fx-006', 'fx/Jump-2.wav', false, false, 0.2],
		  ['fx-007', 'fx/Jump-4.wav', false, false, 0.2],
		  ['fx-008', 'fx/Pickup.wav', false, false, 0.2],
		  ['fx-009', 'fx/Powerup.wav', false, false, 0.2]
	  ].forEach(function(config){
	  	this.loadSound.apply(this, config);
	  }.bind(this));

    this.subscribeToTopics();
  };
  AudioManager.prototype.subscribeToTopics = function(){
  	var playSoundOnTopic = function(topic) {
      var token;
      this.playSound.apply(this, topics[topic]);
      token = [].slice.call(arguments).pop();
      topics[topic].push(token);
	  };

  	for(var topic in topics){
  		this.pubsub.subscribe(topic, playSoundOnTopic.bind(this));
  	}
  };
  AudioManager.prototype.loadSound = function(key, fx, autoPlay, loop, gain) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', fx, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        fxBuffer[key] = buffer;
        
        if(RPG.config.audio.background && autoPlay){
          self.playSound(key, loop, gain);
        }

      }, function() {});
    };
    request.send();
  };
  AudioManager.prototype.toggle = function(soundProfile){
    var isAudioOn = RPG.config.audio[soundProfile];
    isAudioOn = !isAudioOn;
    RPG.config.audio[soundProfile] = isAudioOn;

    if(isAudioOn){
      this.subscribeToTopics();
    }
    else {
      for(var topic in topics){
        if(topics[topic][0] && topics[topic][0].startsWith(soundProfile)){
          this.pubsub.unsubscribe(topics[topic].slice(-1));
          this.stopSound(topics[topic][0]);
        }
      }      
    }
  };
  AudioManager.prototype.toggleAudio = function(){
    this.toggle('background');
    var backgroundFx = topics[RPG.config.topics.SUB_ME_GAME_CREATED];
    if(RPG.config.audio.background){
      this.playSound.apply(null, backgroundFx);
    }
    else {
      this.stopSound(backgroundFx[0]);
    }
  };
  AudioManager.prototype.toggleFx = function(){
    this.toggle('fx');
  };
  AudioManager.prototype.playSound = function(fx, loop, gain) {
    var buffer = fxBuffer[fx];
    if (buffer) {
      var source = fxSource[fx] || context.createBufferSource();
      source.buffer = buffer;
      source.loop = loop || false;
      var volumeNode = context.createGain();
      volumeNode.gain.value = gain || 0.5;
      volumeNode.connect(context.destination);
      source.connect(volumeNode);
      // source.start(context.currentTime);
      source.onended = function(){
        fxSource[fx] = null;
      };
      try {
        source.start(0);
      }
      catch(e){
        // InvalidStateError exception
      }
      fxSource[fx] = source;
    }
  };
  AudioManager.prototype.stopSound = function(fx) {
    if (fxSource[fx]) {
      fxSource[fx].stop(context.currentTime);
    }
  };

  return AudioManager;
});