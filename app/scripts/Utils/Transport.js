/* jshint devel:true */
/* globals RPG */
/**
 * Transport module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Transport', function() {
  
  'use strict';

	function Transport(PubSub){
		this.pubsub = PubSub;
		this.client = Stomp.over(new SockJS('http://localhost:8080/game'));
		this.client.connect({}, this.onConnection.bind(this));
	}

	Transport.prototype.onConnection = function(){
		// subscriptions
		for(var topic in Transport.prototype){
			if(Transport.prototype.hasOwnProperty(topic)){
				this.client.subscribe(topic, function(data) {
					console.log(topic, arguments);
					Transport.prototype[topic].call(this, data);
					this.pubsub.publish(topic);
				}.bind(this));
			}
		}

		// publishes
		this.pubsub.subscribe('/topic/game/player/join', this.send.bind(this));
		this.pubsub.subscribe('/topic/game/player/quit', this.send.bind(this));
	}

	Transport.prototype.send = function(topic, data){
		this.client.send(topic, {}, JSON.stringify(data));
	}

	// topics implementation 

	Transport.prototype[RPG.topics.TOPIC_PLAYER_LIFE] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_REVIVED] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_HIT] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_HEALED] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_STATES] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_JOINED] = function(topic){
		
	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_MOVED] = function(){

	}

	Transport.prototype[RPG.topics.TOPIC_PLAYER_LEFT] = function(){

	}

	Transport.prototype[RPG.topics.TOPIC_ERROR_LOCAL] = function(){

	}	

	Transport.prototype[RPG.topics.TOPIC_ERROR_GLOBAL] = function(){

	}

	Transport.prototype[RPG.topics.TOPIC_MESSAGE_GLOBAL] = function(){

	}

	Transport.prototype[RPG.topics.TOPIC_ACTION_IMAGE_MOVED] = function(){

	}

	return Transport;

});