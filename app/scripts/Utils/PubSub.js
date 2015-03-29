/* jshint devel:true */
/* globals RPG */
/**
 * PubSub module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('PubSub', function() {
  
	'use strict';

	var topics = {};
	var subUid = -1;

	return {
		publish: function(topic) {

			var args = [].slice.call(arguments);

			if (!topics[topic]) {
				return false;
			}
			var subscribers = topics[topic];
			var len = subscribers ? subscribers.length : 0;
			while (len--) {
				subscribers[len].func.apply(null, args.concat(+subscribers[len].token));
			}
			return this;
		},
		subscribe: function(topic, func) {
			if (!topics[topic]) {
				topics[topic] = [];
			}
			var token = (++subUid).toString();
			topics[topic].push({
				token: token,
				func: func
			});
			return token;
		},
		unsubscribe: function(token) {
			for (var m in topics) {
				if (topics[m]) {
					for (var i = 0, j = topics[m].length; i < j; i++) {
						if (topics[m][i].token === token) {
							topics[m].splice(i, 1);
							return token;
						}
					}
				}
			}
			return this;
		},
		on: this.subscribe,
		off: this.unsubscribe,
		fire: this.publish
	};
	
});