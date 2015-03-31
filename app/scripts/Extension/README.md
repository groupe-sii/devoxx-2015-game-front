# devoxx-2015-game-front Extension
extension module for the SII coding game

#API
[the API](http://game.api.devoxx.sii.fr/#!/public/) is available to expose all the features you can invoke from client side.

# Action Extension
## Create your own actions
To add an action to your client game, you have to create an Action Extension for your game stating: 
`RPG.extension(RPG.extensions.ACTION, metadata, callback);`

We recommend you do this in a new file in the *app/scripts/Extension/Action* folder
with metadata object being the following attributes  to build the action button
```javascript
{
 name: 'Attack',
 icon: 'pathToIcon.png'
}
```

and callback being the definition of your action (respecting [the action API](http://game.api.devoxx.sii.fr/#!/public/topic_game_action_post)): 

```javascript
RPG.extension(RPG.extensions.ACTION, { /*metadata*/ }, function() {

  'use strict';

  // put the action logic here

  //the action properties according to the action API
  return { /*action*/ };
});
```

##Helpers
In order to help you code your action definitions, here are some useful helpers: 
- Use an instance of the ActionManager via `RPG.Factory.actionManager()`: 
  - `RPG.Factory.actionManager().getSelectedPosition()` returns the last selected cell.

##Test
- To test without building the app, you have to add your new script in your *app/index.html* file (thank you captain obvious)
- To test in build mode you just have to [build your app](https://github.com/groupe-sii/devoxx-2015-game-front#build-your-code-locally) (and access *dist/index.html*)

##Samples
```javascript
RPG.extension(RPG.extensions.ACTION, {
  name: 'MyAttack',
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
  name: 'MyHeal',
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