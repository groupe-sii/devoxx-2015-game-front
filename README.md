# devoxx-2015-game-front
Game development challenge for devoxx 2015

![Alt text](screenshots/0.png?raw=true "Devoxx ♥ 2015")
![Alt text](screenshots/1.png?raw=true "Devoxx ♥ 2015")

# Contribute

## Prerequisities

- NodeJS (https://nodejs.org/)
- Git (http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- A text editor (http://www.sublimetext.com/3)
- A decent command line tool

## Grab the code

1) Clone this repo and cd into it:

```git clone --recursive https://github.com/groupe-sii/devoxx-2015-game-front && cd devoxx-2015-game-front && git submodule foreach --recursive git checkout master```

This command does three things:
- It clones this repo
- change directory to devoxx-2015-game-front
- Git checkout master branch of all submodules

2) Fist, you need to install Gulp and Bower, using NPM:

```npm i bower gulp```

3) Then, install local deps:

```npm i && bower i```

## Start coding

1) Run a local dev server using Gulp:

``` gulp serve```

## Build your code locally:

If you need to build your code on your machine, use this command:

```gulp build```

## Read the socket server API

The Socket server API documentation is in the documention folder. It is based on Swagger (http://swagger.io/). 
To run it locally, please refere to this repo (https://github.com/groupe-sii/devoxx-2015-game-doc).

You can also [browse the API](http://game.api.devoxx.sii.fr/)


# Push your extensions

## Ask access

Before you can push your changes, you need to ask for write access to the repository. First, you need to create a Github account. Then, you can contact Aurélien Baudet on the SII stand to send you an invitation.

## Pull and push

Once you have developed your extension and you want to view it online, you need to push your changes to the remote git. But before doing this, ensure that you have the latest sources:
```
git pull
```

The merge should be done automatically. If you have conflicts, you can follow these guides to manually merge:
- [Command line merge](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/)
- [Using git mergetool](http://www.gitguys.com/topics/merging-with-a-gui/)

 
Now you can push to remote git server:
```
git push origin master
```

Our Jenkins will automatically build your extensions and deploy them on the server. You will soon see your extensions in action.

/!\ Please, this game has been done for making devoxx even funnier so do not break code of other participants


# Troubleshooting
## Error: Cannot find module 'xxx'
You need to install the xxx module manually:

```npm i xxx```

