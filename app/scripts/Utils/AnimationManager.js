/* jshint devel:true */
/* globals RPG */
/**
 * AnimationManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('AnimationManager', function() {
  'use strict';

  function AnimationManager(GfxDom, PubSub) {
    this.dom = GfxDom;
    this.pubsub = PubSub;
  }
  AnimationManager.prototype.initialize = function() {
  	this.pubsub.subscribe(RPG.topics.SUB_ANIMATION_ALL, function(topic, data){
  		data.forEach(function(animationObject){
  			this.buildKeyFrames(animationObject);
  		}.bind(this));
  	}.bind(this));
    
  };
  AnimationManager.prototype.buildKeyFrames = function(animationObject) {
    var animation = this.parseAnimation(animationObject);
    this.dom.createStyleTag(animation.id, animation.content);
  };
  AnimationManager.prototype.parseAnimation = function(animationObject) {
    var content = [
	    '@-webkit-keyframes #name { #frames }',
	    '  ',
	    '.#name {',
	    '-webkit-animation-fill-mode: none;',
	    '-webkit-animation-direction: #options.direction;',
	    '-webkit-animation-iteration-count: #options.count;',
	    '-webkit-animation-name: #name;',
	    '-webkit-animation-duration: #durations;',
	    '-webkit-animation-delay: #options.delay;',
	    '-webkit-animation-timing-function: steps(#frames.length);',
	    'background: transparent url("#sprite.image.uri") no-repeat left center;'
    ]
    .join('')
    .replace(/#name/g, animationObject.name)
    .replace('#options.direction', animationObject.options.direction.toLowerCase())
    .replace('#options.count', animationObject.options.count)
    .replace('#duration', animationObject.duration/1000)
    .replace('#options.delay', animationObject.options.delay)
    .replace('#frames.length', animationObject.frames.length)
    .replace('#sprite.image.uri', RPG.server.host+animationObject.sprite.image.uri)
    .replace('#frames', '100% {background-position: -'+animationObject.sprite.width+'px;}');

    return {
      id: animationObject.id,
      content: content
    }
  };
  return AnimationManager;
});