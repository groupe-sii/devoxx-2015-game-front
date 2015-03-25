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

  function onClose() {
    this.client.disconnect();
    this.pubsub.publish('/transport/close');
  }

  function onGameSelected(topic, data) {
    RPG.game = data;
    // auto subscriptions
    Object.keys(RPG.topics).forEach(function(topic, index) {
      var serverTopic = RPG.topics[topic];
      if (topic.startsWith('SUB_')) {
        serverTopic = computeTopic(serverTopic);
        this.subscribe(serverTopic);
      } else if (topic.startsWith('PUB_')) {
        this.pubsub.subscribe(serverTopic, this.send.bind(this));
      }
    }.bind(this));
    handleServerErrors.call(this);
  }

  function onConnect() {
    this.subscribe(RPG.topics.SUB_ME_GAME_SELECTED, onGameSelected.bind(this));
    this.send(RPG.topics.PUB_GAME_SELECT);
  }

  function uncomputeTopic(topic) {
    if (topic.indexOf('game-') !== -1) {
      topic = topic.replace(/game-\d+/, '{gameId}');
    }
    return topic;
  }

  function computeTopic(topic) {
    if (topic.indexOf('{gameId}') !== -1) {
      topic = topic.replace('{gameId}', RPG.game.id);
    }
    return topic;
  }

  function handleServerErrors() {
    this.subscribe(RPG.topics.SUB_ERROR_GLOBAL, function(topic, data) {
      console.error('Transport::ServerError', JSON.stringify(data));
    });
  }

  function noop(topic, data) {}

  function Transport(PubSub) {
    this.pubsub = PubSub;
    socket = new SockJS(RPG.socket.url);
    this.client = Stomp.over(socket);
    this.client.onclose = onClose.bind(this);
    this.client.onerror = onClose.bind(this);
    // this.client.debug = null;
  }
  Transport.prototype.initialize = function() {
    this.client.connect({}, onConnect.bind(this), onClose.bind(this));
  };
  Transport.prototype.subscribe = function(topic, callback) {
    this.client.subscribe(topic, function(data) {
      data = JSON.parse(data.body || data);
      topic = uncomputeTopic(topic);
      this.pubsub.publish(topic, data);
      if (callback && callback.call) {
        callback(topic, data);
      }
    }.bind(this));
  };
  Transport.prototype.send = function(topic, data) {
    topic = computeTopic(topic);
    this.client.send(topic, {}, JSON.stringify(data));
  };
  return Transport;
});