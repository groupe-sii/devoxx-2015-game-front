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
		this.client.subscribe('/topic/game/board/added', function(data) {
			console.debug('player added on board', JSON.parse(data.body));
		});
		this.client.subscribe('/queue/error', function(data) {
			console.error(data);
		});
		this.pubsub.subscribe('/server/player/join', function(){
			var data = [].slice.call(arguments, 1); // remove the topic
			this.client.send('/topic/game/player/join', {}, JSON.stringify(data[0]));
		}.bind(this));
	}

	return Transport;

});