/* jshint devel:true */
/* globals RPG */
/**
 * Gfx core module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('GfxCore', function() {
  'use strict';

  function GfxCore(GfxDom, GfxEventManager){
  	this.dom = GfxDom;
  	this.eventManager = GfxEventManager;
  }

  GfxCore.prototype.initialize = function(){
  	this.dom.initialize();
  	this.eventManager.initialize(this.dom);
  };

  return GfxCore;

});