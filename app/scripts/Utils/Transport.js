/* jshint devel:true */
/* globals RPG */
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
    this.client.connect({}, this.onConnection.bind(this));
  }
  Transport.prototype.onConnection = function() {
    // subscriptions
    for (var topic in Transport.prototype) {
      if (topic && topic[0] === '/' && Transport.prototype.hasOwnProperty(topic)) {
        this.subscribe(topic);
      }
    }
    // publishes
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_JOIN, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_LEAVE, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_DOWN, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_UP, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_LEFT, this.send.bind(this));
    this.pubsub.subscribe(RPG.topics.PUB_PLAYER_MOVE_RIGHT, this.send.bind(this));
  }
  Transport.prototype.subscribe = function(topic){
  	this.client.subscribe(topic, function(data) {
      console.log(topic, data);
      Transport.prototype[topic].call(this, data);
      this.pubsub.publish(topic, JSON.parse(data.body || data));
    }.bind(this));
  }
  Transport.prototype.send = function(topic, data) {
      this.client.send(topic, {}, JSON.stringify(data));
    }
    // topics implementation 
  // Transport.prototype[RPG.topics.PUB_PLAYER_JOIN] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_PLAYER_LEAVE] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_DIED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_REVIVED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_HIT] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_HEALED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_STATES] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_LIFE] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_PLAYER_MOVE_UP] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_PLAYER_MOVE_DOWN] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_PLAYER_MOVE_LEFT] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_PLAYER_MOVE_RIGHT] = function(topic) {}
  // Transport.prototype[RPG.topics.PUB_ACTION] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_ACTION_IMAGE_MOVED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_MOVED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_JOINED] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_PLAYER_LEFT] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_ERROR_GLOBAL] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_MESSAGE_GLOBAL] = function(topic) {}
  Transport.prototype[RPG.topics.SUB_ERROR_LOCAL] = function(topic) {}
  return Transport;
});