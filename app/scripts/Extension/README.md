# devoxx-2015-game-front Extension Definition Module (EDM)
The extension definition module for the SII coding game

# Action Extension API

## Create your own actions
In order to implement a new action in the client side, you have to create an Extension Definition Module or EDM of type Action for your game using the provided API: `RPG.extension(RPG.extensions.ACTION, metadata, callback);`

##Convention
Our convention states that each action must be defined in its own file in the *app/scripts/Extension/Action* folder.

##API Documentation
The API documentation is:
- `type`: Enum - must be `RPG.extensions.ACTION`
- `metadata`: the object with the following attributes:
  - `name`: String - the name of the action
  - `icon`: String - the image source of the action (used to draw the action button)
- `callback`: Function - the action definition according to [the action API](http://game.api.devoxx.sii.fr/#!/public/topic_game_action_post)

Here is a boilerplate of an EDM of type Action:

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