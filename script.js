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
// class for generating snowflakes
class SnowFlake {
    constructor(x, y, imageObj) {
        this.x = x;
        this.y = y;
        this.imageObj = imageObj;
    }
    giveDirection() {
        this.dx = 4;
        this.dy = 0;
    }
    update() {
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
        let imageObj;
        await (function addImageProcess(){
            return new Promise((resolve, reject) => {
                imageObj = new Image(size, size)
                imageObj.onload = () => resolve();
                imageObj.onerror = reject;
                imageObj.src = imageUrl;
            })
        })();

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
        // imageObj.addEventListener("load", () => {
        // });
        ctx.globalAlpha = imageObj.style.opacity;
        ctx.drawImage(imageObj, x, y, imageObj.width, imageObj.height);
        snowFlakes[i].update();
    }
    // requestAnimationFrame(draw);
    // setInterval(draw, 2000);
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
    // look up breakout game for further progress...
    draw();
}

let url = "/letItSnow.json";
window.letItSnow("snowFlakesJS", url);