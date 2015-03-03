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
		this.client = Stomp.over(new SockJS('http://192.168.0.32:8080/survival-game/game'));
		this.topics = {
			subscribeTo : {
				'/server/player/join': '/topic/game/player/join'
			},
			publishTo : [
				'/topic/game/board/added'
			]
		};
		this.client.connect({}, this.onConnection.bind(this));
	}

	Transport.prototype.onConnection = function(){
		// this.topics.publishTo.forEach(function(topic){
		// 	this.client.subscribe(topic, function(){
		// 		this.pubsub.publish(topic);
		// 	}.bind(this));
		// }.bind(this));

		// for(var topic in this.topics.subscribeTo){
		// 	this.pubsub.subscribe(topic, function(){
		// 		var data = [].slice.call(arguments, 1); // remove the topic
		// 		this.client.send(this.topics.subscribeTo[topic], {}, JSON.stringify(data[0]));
		// 	}.bind(this));
		// }
		// 
		// this.client.subscribe('/topic/game/board/added', this.pubsub.subscribe);
		this.pubsub.subscribe('/server/player/join', function(){
			var data = [].slice.call(arguments, 1); // remove the topic
			this.client.send('/topic/game/board/added', {}, JSON.stringify(data[0]));
		}.bind(this));
	}

	return Transport;

});