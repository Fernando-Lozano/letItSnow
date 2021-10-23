// ------- canvas -------
let canvas;
let ctx;
let dpi = window.devicePixelRatio;


// ------- initialize canvas -------

function initializeCanvas(div) {
    const container = document.getElementById(div);
    canvas = document.createElement("canvas");
    container.appendChild(canvas);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx = canvas.getContext("2d");
    fix_dpi();    
}
// fixes canvas blur
function fix_dpi() {
    //create a style object that returns width and height
    let style = {
        height() {
            return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
        },
        width() {
            return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        }
    }
    //set the correct attributes for a crystal clear image!
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
}

// -------- snowFlakes -------

let snowFlakes = [];

// getting a random rumber with min and max inclusive
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

// class for generating snowflakes
class SnowFlake {
    constructor(x, y, imageObj) {
        this.x = x;
        this.y = y;
        this.imageObj = imageObj;
    }
    giveDirection() {
        // sideways speed
        this.dx = Math.round((Math.random() * 8) - 4);
        // downward speed
        this.dy = getRandomIntInclusive(2, 8);
    }
    update() {
        // if out of bounds move to random position on opposite side of canvas
        if (this.dx > 0 && this.x > canvas.width) {
            this.x = 0 - this.imageObj.width
            this.y = getRandomIntInclusive(0, canvas.height);
        }
        else if (this.dx < 0 && this.x < 0 - this.imageObj.width) {
            this.x = canvas.width;
            this.y = getRandomIntInclusive(0, canvas.height);
        }
        if (this.y > canvas.height) {
            this.y = 0 - this.imageObj.height;
            this.x = getRandomIntInclusive(0, canvas.width);
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}

// creates instances of snowflakes and pushes them into an array
async function generateSnowFlakes(number, sizes, images, opacity) {
    for (let i = 0; i < number; i++) {

        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * canvas.height);

        let size;
        if (sizes.differentSizes) {
            size = Math.floor(Math.random() * sizes.max) + sizes.min;
        } else {
            size = sizes.value;
        }

        // makes image object
        let imageUrl = images[Math.floor(Math.random() * images.length)];
        let imageObj = new Image(size, size);
        imageObj.src = imageUrl;

        let oPacity;
        if (opacity.random) {
            oPacity = Math.ceil(Math.random() * 100) / 100;
        } else {
            oPacity = opacity.value;
        }
        imageObj.style.opacity = oPacity;

        let snowFlake = new SnowFlake(x, y, imageObj);
        snowFlake.giveDirection();
        snowFlakes.push(snowFlake);
    }
}
// ------- drawing to canvas -------

async function draw() {
    //call the dpi fix every time to fix canvas blur
    //canvas is redrawn
    fix_dpi();
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snowFlakes.length; i++) {
        let { x, y, imageObj } = snowFlakes[i];
        ctx.globalAlpha = imageObj.style.opacity;
        ctx.drawImage(imageObj, x, y, imageObj.width, imageObj.height);
        snowFlakes[i].update();
    }
    requestAnimationFrame(draw);
}

// begins the particle effect
window.letItSnow = async function(divId, configUrl) {

    let params

    // load the config file
    await fetch(configUrl).then(response => {
        return response.json();
    }).then(data => {
        params = data;
        return;
    }).catch(err => {
        alert("Something is wrong with the url\n" + err);
    });
    // initialize canvas
    initializeCanvas(divId);

    // initialize snowFlakes
    const { number, images, opacity, sizes } = params.snowFlakes;
    await generateSnowFlakes(number, sizes, images, opacity);
    draw();
}

let url = "/letItSnow.json";
window.letItSnow("snowFlakesJS", url);