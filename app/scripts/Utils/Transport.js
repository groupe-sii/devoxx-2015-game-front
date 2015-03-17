/* jshint devel:true */
/* globals RPG,Stomp,SockJS */
/**
 * Transport module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Transport', function() {
  'use strict';

  function Transport(PubSub) {
    this.pubsub = PubSub;
    this.client = Stomp.over(new SockJS(RPG.socket.url));
    this.client.debug = null;
  }
  Transport.prototype.initialize = function(){
    this.client.connect({}, this.onConnection.bind(this));
  };
  Transport.prototype.close = function(){
  	this.client.disconnect();
  };
  Transport.prototype.onConnection = function() {
    this.subscribe(RPG.topics.SUB_ME_GAME_SELECTED, this.onGameSelected.bind(this));
    this.send(RPG.topics.PUB_GAME_SELECT);
  };
  Transport.prototype.onGameSelected = function(data) {
    data = JSON.parse(data.body || data);

    this.game = data;

    // subscriptions
    for (var topic in Transport.prototype) {
      if (topic && topic[0] === '/' && Transport.prototype.hasOwnProperty(topic)) {
        topic = this.computeTopic(topic);
        this.subscribe(topic);
      }
    }

    // publishes
    this.pubsub.subscribe(RPG.topics.PUB_GAME_JOIN, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_DOWN, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_UP, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_LEFT, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_RIGHT, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_LEAVE, this.send.bind(this));

    // this.pubsub.subscribe('/transport/close', this.close.bind(this));
  };
  Transport.prototype.subscribe = function(topic, callback){
    this.client.subscribe(topic, callback || function(data) {
      data = JSON.parse(data.body || data);
      topic = this.uncomputeTopic(topic);
      if(Transport.prototype[topic]){
        Transport.prototype[topic].call(this, data);
      }
      else {
        console.error('Transport: ', topic, ' is not defined.');
      }
      this.pubsub.publish(topic, data);
    }.bind(this));
  };
  Transport.prototype.send = function(topic, data) {
    topic = this.computeTopic(topic);
    this.client.send(topic, {}, JSON.stringify(data));
  };
  Transport.prototype.uncomputeTopic = function(topic){
    if(topic.indexOf('game-') !== -1){
      topic = topic.replace(/game-\d/, '{gameId}');
    }
    return topic;
  };
  Transport.prototype.computeTopic = function(topic){
    if(topic.indexOf('{gameId}') !== -1){
      topic = topic.replace('{gameId}', this.game.id);
    }
    return topic;
  };

  // // topics implementation 
  Transport.prototype[RPG.topics.SUB_ME_JOINED_GAME] = function(/*data*/) {};
  Transport.prototype[RPG.topics.SUB_PLAYER_MOVED] = function(/*data*/) {};
  Transport.prototype[RPG.topics.SUB_PLAYER_CREATED] = function(/*data*/) {};
  Transport.prototype[RPG.topics.SUB_PLAYER_HIT] = function(/*data*/) {};
  
  Transport.prototype[RPG.topics.SUB_ME_ERROR_LOCAL] = function(data) {
    console.log('SUB_ME_ERROR_LOCAL', data);
  };
  Transport.prototype[RPG.topics.SUB_MESSAGE_GLOBAL] = function(data) {
    console.log('SUB_MESSAGE_GLOBAL', data);
  };
  return Transport;
});