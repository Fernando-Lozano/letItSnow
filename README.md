# Snow flake canvas

This project has been inspired by particle.js. I intend to reference it throughout this project. The goal for this library is to have a customizable snowflake effect on canvas.

## The canvas:

The canvas will be added via JS, and should fit the div it is in. I will tack on a function to "window" where the user needs to provide a route to the config file as well as the id for the div to use. I will copy particle.js for this... Maybe learn about the window object a bit. For the background, it must be set on the parent div.

## The particles:
    The config file will have:
        - number of particles
        - an array of routes to svg images (for variety)
        - an arrary of colors (?)
        - variation on sizes
        - variation on opacity of particles
        - velocity of snowflakes
    I believe I will make a class for the particles

## The load function:

called "window.letItSnow(div, config file route);

## Todo:

allow options for changing the velocity of snowflakes
check if svg images can have colors changed

## Progress:

initialized canvas and particles
added images to canvas
functioning!

