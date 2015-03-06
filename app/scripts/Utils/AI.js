/* jshint devel:true */
/* globals RPG */
/**
 * AI module.
 * @type {Class}
 * @author Wassim Chegham
 */
RPG.module('AI', function() {
  'use strict';

  function AI() {}
  AI.prototype.getFreeNeighbours = function(cellPosition) {
    var pos = {
      x: +cellPosition.x,
      y: +cellPosition.y
    };
    return [{
      direction: 'up',
      position: {
        x: pos.x,
        y: pos.y - 1
      }
    }, {
      direction: 'down',
      position: {
        x: pos.x,
        y: pos.y + 1
      }
    }, {
      direction: 'left',
      position: {
        x: pos.x - 1,
        y: pos.y
      }
    }, {
      direction: 'right',
      position: {
        x: pos.x + 1,
        y: pos.y
      }
    }].filter(function(cell) {
      var c = document.querySelector('td[data-x="' + cell.position.x + '"][data-y="' + cell.position.y + '"]');
      return c && !c.classList.contains('rpg-occupied');
    });
  };
  return AI;
});