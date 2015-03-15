# devoxx-2015-game-front
Game development challenge for devoxx 2015

![Alt text](screenshots/1.png?raw=true "Devoxx ♥ 2015")
![Alt text](screenshots/2.png?raw=true "Devoxx ♥ 2015")
![Alt text](screenshots/3.png?raw=true "Devoxx ♥ 2015")
![Alt text](screenshots/4.png?raw=true "Devoxx ♥ 2015")

## Contribute

### Prerequisities

- NodeJS (https://nodejs.org/)
- Git (http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- A text editor (http://www.sublimetext.com/3)
- A decent command line tool

### Grab the code

1) Clone this repo and cd into it:

```git clone --recursive https://github.com/groupe-sii/devoxx-2015-game-front && cd devoxx-2015-game-front```

2) Fist, you need to install Gulp and Bower, using NPM:

```npm i bower gulp```

3) Then, install local deps:

```npm i```

### Start coding

1) Run a local dev server using Gulp:

``` gulp serve```

### Build your code locally:

If you need to build your code on your machine, use this command:

```gulp build```

### Read the socket server API

The Socket server API documentation is in the documention folder. It is based on Swagger (http://swagger.io/). To access it, run this command:

```cd documentation && npm run doc```

This will start a local http server at your http://localhost:8888.

### Troubleshooting
#### Error: Cannot find module 'xxx'
You need to install the xxx module manually:

```npm i xxx```

