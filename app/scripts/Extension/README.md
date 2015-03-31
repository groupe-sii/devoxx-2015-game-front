# devoxx-2015-game-front Extension
extension module for the SII coding game

#API
[the API](http://game.api.devoxx.sii.fr/#!/public/) is available to expose all the features you can invoke from client side.

# Action Extension
## Create your own actions
To add an action to your client game, you have to create an Action Extension for your game stating : 
` RPG.extension(RPG.extensions.ACTION, metadata, callback);`

We recommed you do this in a new file  in the *app/scripts/Extension/Action* folder

with metadata being a two attributes (name, icon) object to build the action button
```javascript
{'name' : 'Attack',
 'icon' : 'pathToIcon.png'
}
```

and callback being the code of your action (respecting [the action API](http://game.api.devoxx.sii.fr/#!/public/topic_game_action_post)) : 
```javascript
var attack = function() {
  'use strict';
  //local variables

  return object;//the action properties according to the action API
}
```

##Tools
In the Utils folder you'll find some tolls to help you in coding your functions, here are the most useful for actions : 
* Factory.js is a module containing all tools
  * to summon the modulle use RPG.Factory
* ActionManager contains the tools to help using actions
  * summoned by RPG.Factory.actionManager()
  * RPG.Factory.actionManager().getSelectedPosition(); returns the last clicked cell

##Test
- To test without building the app, you have to add your new script in your *app/index.html* file (thank you captain obvious)
- To test in build mode you just have to [build your app](https://github.com/groupe-sii/devoxx-2015-game-front#build-your-code-locally) (and access *dist/index.html*)

##Samples
```javascript
RPG.extension(RPG.extensions.ACTION, {
  name: 'Attack',
  icon: 'images/hud/special_icons_0015.png'
}, function attack() {
  
  'use strict';
  
	var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: -((Math.random() * 1000) |  0)
  };
});

RPG.extension(RPG.extensions.ACTION, {
  name: 'Heal',
  icon: 'images/hud/special_icons_0016.png'
}, function heal() {
  
  'use strict';
  
	var cell = RPG.Factory.actionManager().getSelectedPosition();

  return {
    '@c': '.UpdateCurrentLife',
    cell: cell,
    increment: 200
  };
});
```