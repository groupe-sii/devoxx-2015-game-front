/* jshint devel:true */
/* globals RPG,Stomp,SockJS */
/**
 * Transport module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Transport', function() {
  'use strict';

  var socket = null;
  var topics = {};

  function onClose(){
    this.client.disconnect();
    this.pubsub.publish('/transport/close');
  }

  function onConnect() {
    this.subscribe(RPG.topics.SUB_ME_GAME_SELECTED, this.onGameSelected.bind(this));
    this.send(RPG.topics.PUB_GAME_SELECT);
  }

  function Transport(PubSub) {
    this.pubsub = PubSub;
    socket = new SockJS(RPG.socket.url);
    this.client = Stomp.over(socket);
    this.client.onclose = onClose.bind(this);
    this.client.onerror = onClose.bind(this);
    // this.client.debug = null;
  }
  Transport.prototype.initialize = function(){
    this.client.connect({}, onConnect.bind(this), onClose.bind(this));
  };
  Transport.prototype.onGameSelected = function(data) {
    data = JSON.parse(data.body || data);

    this.game = data;

    // subscriptions
    Object.keys(RPG.topics).forEach(function(topic, index){
      var serverTopic = RPG.topics[topic];
      if (topic.startsWith('SUB_')) {
        this.subscribe(serverTopic);
      }
      else if(topic.startsWith('PUB_')){
        this.pubsub.subscribe(serverTopic, this.send.bind(this));
      }
    }.bind(this));

    // publishes
    // this.pubsub.subscribe(RPG.topics.PUB_GAME_JOIN, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_GAME_LEAVE, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_DOWN, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_UP, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_LEFT, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_RIGHT, this.send.bind(this));
    // this.pubsub.subscribe(RPG.topics.PUB_PLAYER_LEAVE, this.send.bind(this));

  };
  Transport.prototype.subscribe = function(topic, callback){
    this.client.subscribe(topic, callback || function(data) {
      data = JSON.parse(data.body || data);
      topic = this.uncomputeTopic(topic);
      // if(topics[topic]){
      //   topics[topic].call(this, this.computeTopic(topic), data);
      // }
      // else {
      //   console.error('Transport: ', topic, ' is not defined. Did you forget to implement it?');
      // }
      this.pubsub.publish(topic, data);
    }.bind(this));
  };
  Transport.prototype.send = function(topic, data) {
    console.log('Transport', 'sent', this.computeTopic(topic));
    topic = this.computeTopic(topic);
    this.client.send(topic, {}, JSON.stringify(data));
  };
  Transport.prototype.uncomputeTopic = function(topic){
    if(topic.indexOf('game-') !== -1){
      topic = topic.replace(/game-\d+/, '{gameId}');
    }
    return topic;
  };
  Transport.prototype.computeTopic = function(topic){
    if(topic.indexOf('{gameId}') !== -1){
      topic = topic.replace('{gameId}', this.game.id);
    }
    return topic;
  };

  // topics implementations

  // Player topics
  topics[RPG.topics.SUB_ME_GAME_CREATED] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_ME_JOINED_GAME] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_HIT] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_CREATED] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_MOVED] = function(topic, data) {
    //console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_DIED] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_REVIVED] = function(topic, data){
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_HIT] = function(topic, data){
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_HEALED] = function(topic, data){
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_STATES] = function(topic, data){
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_PLAYER_LIFE_LEVEL] = function(topic, data){
    console.log('Transport', 'received', topic);
  };

  // Errors topics

  topics[RPG.topics.SUB_ME_ERROR_LOCAL] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };
  topics[RPG.topics.SUB_MESSAGE_GLOBAL] = function(topic, data) {
    console.log('Transport', 'received', topic);
  };

  return Transport;
});