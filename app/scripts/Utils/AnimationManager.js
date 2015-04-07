/* jshint devel:true */
/* globals RPG */
/**
 * AnimationManager module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('AnimationManager', function() {

  /* jshint validthis:true */
  
  'use strict';

  var xhr = new XMLHttpRequest();
  var animationsList = [];
  (function(){
    [].slice.call(document.querySelectorAll('.iso')).forEach(function(el){
      el.addEventListener('click', function(e){
        document.body.classList.toggle('isometric');
      });
    });
  }());

  function bindTopics(content) {
    RPG.Factory.transport().handleAnimationTopics(function(topic, data){

      data.forEach(function(animationObject){
        var anim = {
          info: animationObject,
          content: content
        };

        this.pubsub.publish(RPG.config.topics.GFX_ANIMATION_REGISTER, anim);
        animationsList.push(anim);
      }.bind(this));

    }.bind(this));
  }

  function loadAnimation(styleSheet, callback) {
    xhr.open('GET', styleSheet+'?_='+(+new Date()), true);
    xhr.onload = function(response) {
      this.animationsContent = response.target.response;
      callback.call(this, this.animationsContent);
    }.bind(this);
    xhr.send();
  }

  function parseAnimation(animationObject) {
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
    .replace('#sprite.image.uri', animationObject.sprite.image.uri)
    .replace('#frames', '100% {background-position: -'+animationObject.sprite.width+'px;}');

    return {
      id: animationObject.id,
      content: content
    };
  }

  function AnimationManager(GfxDom, PubSub) {
    this.dom = GfxDom;
    this.pubsub = PubSub;
    this.animationsContent = '';
  }
  AnimationManager.prototype.initialize = function() {
    loadAnimation.call(this, RPG.config.animations.url, bindTopics.bind(this));
  };
  AnimationManager.prototype.getAnimationsList = function() {
    return animationsList;
  };
  AnimationManager.prototype.buildKeyFrames = function(animationObject) {
    var animation = parseAnimation(animationObject);
    this.dom.createStyleTag(animation.id, animation.content);
  };
  return AnimationManager;
});