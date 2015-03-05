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
     * Defines a configuration module.
     * @param  {Object} obj A configuration object.
     */
    config: function config(obj) {
      var defineProperty = function(cf){
        Object.defineProperty(RPG, cf, {
          get: function get() {
            return this.__config__[cf];
          }
        });
      }
      for (var cf in obj) {
        if (obj.hasOwnProperty(cf)) {
          RPG.__config__[cf] = obj[cf];
          defineProperty(cf);
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
        else {
          
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

    /**
     * Run the given callback when the DOM is ready.
     * @param  {Function} callback The function to be executed when on domready event.
     */
    run: function run(callback) {
      window.addEventListener('load', callback.bind(RPG), false);
    }
  };
}());