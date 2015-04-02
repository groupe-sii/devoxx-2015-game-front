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
  var playing = {};

  // WARNING: dont play a sound on players moves (RPG.config.topics.SUB_PLAYER_MOVED)
  // there will be too many of them!!!

  topics[RPG.config.topics.SUB_ME_GAME_CREATED] = ['background-001', true];
  topics[RPG.config.topics.SUB_ME_JOINED_GAME] = ['fx-015', false, 1];
  topics[RPG.config.topics.SUB_PLAYER_HIT] = [['fx-010','fx-011', 'fx-012', 'fx-013'], false, 1];
  topics[RPG.config.topics.SUB_PLAYER_DIED] = ['fx-001', false, 1];
  // topics[RPG.config.topics.SUB_PLAYER_HEALED] = ['fx-008', false];
  topics[RPG.config.topics.PUB_GAME_ACTION] = [['fx-010','fx-011', 'fx-012', 'fx-013'], false, 1];

  function AudioManager(PubSub){
  	this.pubsub = PubSub;
  }
  AudioManager.prototype.initialize = function(){
    // configure and load fx files
  	[
      ['background-001', 'fx/bg/Heroic_Demise.mp3', true, true, 0.6],
      ['background-002', 'fx/bg/Battle_Pirate.mp3', false, true, 0.6],
      ['background-003', 'fx/bg/GoT.mp3', false, true, 0.6],

		  ['fx-001', 'fx/Explosion-1.wav', false, false, 0.3],
		  ['fx-002', 'fx/Collide-1.wav', false, false, 0.3],
		  ['fx-003', 'fx/Game_Over.mp3', false, false, 0.3],
		  ['fx-004', 'fx/Jump-1.wav', false, false, 0.3],
		  ['fx-005', 'fx/Jump-3.wav', false, false, 0.3],
		  ['fx-006', 'fx/Jump-2.wav', false, false, 0.3],
		  ['fx-007', 'fx/Jump-4.wav', false, false, 0.3],
		  ['fx-008', 'fx/Heal-1.mp3', false, false, 0.01],
      ['fx-009', 'fx/Powerup-1.wav', false, false, 0.3],
		  
      ['fx-010', 'fx/hits/ogre1.wav', false, false, 0.1],
      ['fx-011', 'fx/hits/ogre2.wav', false, false, 0.1],
      ['fx-012', 'fx/hits/ogre3.wav', false, false, 0.1],
      ['fx-013', 'fx/hits/ogre4.wav', false, false, 0.1],
      ['fx-014', 'fx/hits/ogre5.wav', false, false, 0.1],
      
      ['fx-015', 'fx/Click-1.wav', false, false, 0.3]


	  ].forEach(function(config){
	  	this.loadSound.apply(this, config);
	  }.bind(this));

    this.subscribeToTopics();
  };
  AudioManager.prototype.subscribeToTopics = function(){
  	var playSoundOnTopic = function(topic) {
      var token;

      // if(playing[fx]){

        this.playSound.apply(this, topics[topic]);
        token = [].slice.call(arguments).pop();
        topics[topic].push(token);
        // playing[fx] = true;
        
      // }

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

    if(fx && fx instanceof Array){
      fx = fx[ (Math.random() * fx.length-1) | 0 ];
    }

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
        playing[fx] = false;
      };

      try {
        source.start(0);
      }
      catch(e){
        // InvalidStateError exception
        // console.error(e);
        source.stop(0);
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