/* jshint devel:true */
/**
 * RPG namespace
 * @type {Object}
 * @author Wassim Chegham
 */
var RPG = (function() {

  'use strict';
  
  return {

    /**
     * Objects containing all the internal API.
     * @type {Object}
     */
    __entities__: {},
    __modules__: {},
    __config__: {},


    /**
     * Authorized extensions types
     * @type {Enum}
     */
    extensions: {
      ACTION: 'extension_action'
    },

    /**
     * Defines a configuration module.
     * @param  {Object} obj A configuration object.
     */
    config: function config(obj) {

      for (var cf in obj) {
        if (obj.hasOwnProperty(cf)) {
          RPG.config[cf] = obj[cf];
        }
      }

    },

    /**
     * Defines a module.
     * @param  {String}   name     The module name.
     * @param  {Function} callback The module definition.
     */
    module: function module(name, callback) {

      RPG.__modules__[name] = callback.apply(RPG);
      
      Object.defineProperty(RPG, name, {
        get: function get() {
          return this.__modules__[name];
        }
      });

    },
    
    /**
     * Defines a entity.
     * @param  {String}   name     The entity name.
     * @param  {String}   inherit     The entity name to inherit from.
     * @param  {Function} callback The entity definition.
     */
    entity: function entity(name, inherit, callback) {
      
      var ent = null;
      var inherited = null;

      if(typeof name !== 'string'){
        throw 'Entity name must be a String.';
      }
      else if(typeof inherit === 'function'){
        callback = inherit;
      }
      else if(typeof inherit === 'string'){
        inherited = RPG.__entities__[inherit];
        if (!inherited){
          throw 'Inherited entity "'+inherit+'" was not found.';
        }
      }

      RPG.__entities__[name] = callback.apply(RPG);

      if(inherited){
        ent = RPG.__entities__[name];
        ent.prototype = Object.create(inherited.prototype);
        ent.prototype.constructor = ent;
      }

      Object.defineProperty(RPG, name, {
        get: function get() {
          return this.__entities__[name];
        }
      });

    },

    extension: function(type, info, callback){

      var actionManager;

      switch(type){
        case RPG.extensions.ACTION:
          actionManager = RPG.Factory.actionManager();
          actionManager.addAction(info, callback);
        break;
        default: 
          throw Error('Extension "',type+':'+info.name,'" not allowed! Valid extensions are: ', Object.keys(RPG.extensions))
      }

    },

    /**
     * Run the given callback when the DOM is ready.
     * @param  {Function} callback The function to be executed when on domready event.
     */
    run: function run(callback) {
      window.addEventListener('load', callback.bind(RPG), false);
    }
  };
}());