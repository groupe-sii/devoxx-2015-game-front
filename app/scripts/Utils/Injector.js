/* jshint devel:true */
/* globals RPG */
/**
 * Dependency Injector module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Injector', function() {
  
  'use strict';

	var dependencies_ = {};

	function getDependencies_(args) {
		return args.map(function(value) {
			return RPG.Injector.invoke(RPG[trim(value)]);
			// return RPG.Injector.invoke(dependencies_[trim(value.toLowerCase())]);
		});
	}

	function trim(str) {
		return str.replace(' ', '', 'g');
	}

	return {
		inject: function(dependency) {
			if(typeof dependency === 'function'){
				var name = dependency.toString().match(/function\s*([a-zA-Z_]+)/)[1];
				dependencies_[trim(name.toLowerCase())] = dependency;
			}
			return this;
		},
		invoke: function(target) {
			if(typeof target === 'function'){
				var args = target.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1];
				args = args === '' ? [] : getDependencies_(args.split(','));
				var Constructor = function() {
					return target.apply(this, args);
				};
				return RPG.Factory.instance(Constructor, target);
			}
			return target;
		}
	};

});