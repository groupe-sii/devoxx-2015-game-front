/* jshint devel:true */
/* globals RPG */
/**
 * Dependency Injector module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('Injector', function() {
  'use strict';

	var dependencies = {};

	function getDependencies(args) {
		//@todo there is a recursive call bug here!!! It needs to be fixed.
		return args.map(function(constructorName) {
			return RPG.Injector.invoke(RPG[constructorName]);
		});
	}

	function trim(str) {
		return str.replace(' ', '', 'g');
	}

	function functionName(fn){
		return trim(fn.name || fn.toString().match(/function\s*([a-zA-Z_]+)/)[1]);
	}

	function functionArgs(fn){
		return fn.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].split(',').map(trim);
	}

	return {
		inject: function(dependency) {
			if(typeof dependency === 'function'){
				dependencies[ functionName(dependency) ] = dependency;
			}
			return this;
		},
		invoke: function(dependency) {
			if(typeof dependency === 'function'){
				var args = functionArgs(dependency);
				args = args === '' ? [] : getDependencies(args);
				var Constructor = function() {
					return dependency.apply(this, args);
				};
				return RPG.Factory.instance(Constructor, dependency);
			}
			return dependency;
		}
	};

});