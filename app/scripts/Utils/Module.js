/* jshint devel:true */
/**
 * RPG namespace
 * @type {Object}
 * @author Wassim Chegham
 */
var RPG = (function() {

  'use strict';

  function validateActionDefinition(){
    var args = [].slice.call(arguments);
    if(args.length !== 3){
      throw Error('EDM::WrongParameters: Expected 3 parameters, got '+args.length);
    }
    
    if(!args[0]){
      throw Error('EDM::MissingParameter: Extension type is missing.');
    }
    if(!args[1]){
      throw Error('EDM::MissingParameter: Extension metadata is missing.');
    }
    if(!args[2]){
      throw Error('EDM::MissingParameter: Extension function definition is missing.');
    }

    if(Object.keys(RPG.extensions).indexOf(args[0]) !== -1){
      throw Error('EDM::WrongParameter: Extension type "'+args[0]+'" is not valid.');
    }
    if(typeof args[1].name !== 'string'){
      throw Error('EDM::WrongParameter: Extention name "'+args[1].name+'" is not valid.');
    }
    if(typeof args[1].icon !== 'string'){
      throw Error('EDM::WrongParameter: Extention icon "'+args[1].icon+'" is not valid.');
    }
    if(typeof args[2] !== 'function'){
      throw Error('EDM::WrongParameter: Extention function definition "'+args[2]+'" is not valid.');
    }
  }
  
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
      ACTION: 'extension_action',
      ANIMATION: 'extension_animation',
      AUDIO: 'extension_audio'
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
        ent.prototype = new inherited();
        ent.prototype.constructor = ent;
      }

      Object.defineProperty(RPG, name, {
        get: function get() {
          return this.__entities__[name];
        }
      });

    },

    /**
     * Defines an extension
     * @param  {String}   type     One of the RPG.extensions
     * @param  {Object}   info     The extension meta-information
     *                             name: The name of the extension.
     *                             icon: The image source of the extennsion.
     * @param  {Function} callback The extension definition
     */
    extension: function(type, info, callback){

      var actionManager, ext;
      validateActionDefinition.apply(null, arguments);

      switch(type){
        case RPG.extensions.ACTION:
          actionManager = RPG.Factory.actionManager();
          actionManager.addAction(info, callback);
        break;
        default: 
          ext = Object.keys(RPG.extensions).map(function(x){
            return 'RPG.extensions.'+x;
          })
          throw Error('Extension "'+type+':'+info.name+'" not valid! Allowed extensions are: '+ ext);
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