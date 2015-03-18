/* jshint devel:true */
/* globals RPG */
/**
 * Gfx core module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxCore', function() {
  'use strict';

  function GfxCore(GfxDom, GfxSubscriber){
  	this.dom = GfxDom;
  	this.subscriber = GfxSubscriber;
  }

  GfxCore.prototype.initialize = function(){
  	this.dom.initialize();
  	this.subscriber.initialize(this.dom);
  };

  return GfxCore;

});