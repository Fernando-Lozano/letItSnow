let canvas;
let ctx;
const dpi = window.devicePixelRatio;


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


// extend image object
class Snowflake extends Image {
    constructor(x, y, size) {
        super();
        this.snowFlake = {
            x,
            y,
            size,
            dx: 0,
            dy: 0
        }
    }
    giveDirection(velocity) {
        let that = this.snowFlake;
        let speedV;
        let angleV;
        // get speed
        let { random: random1, min: min1, max: max1 } = velocity.speed;
        if (random1) {
            speedV = getRandomIntInclusive(min1, max1);
        } else {
            speedV = velocity.speed.value;
        }
        // get angle
        let { random: random2, min: min2, max: max2 } = velocity.angle;
        if (random2) {
            angleV = getRandomIntInclusive(min2, max2);
        } else {
            angleV = velocity.angle.value;
        }
        let side1 = Number((Math.cos(angleV * (Math.PI / 180)) * speedV).toFixed(2));
        let side2 = Number((Math.sqrt((speedV ** 2) - (side1 ** 2))).toFixed(2));

        switch (velocity.direction) {
            case "u":
                that.dy = -side1;
                Math.round(Math.random()) ? that.dx = -side2 : that.dx = side2;
                break;
            case "d":
                that.dy = side1;
                Math.round(Math.random()) ? that.dx = -side2 : that.dx = side2;
                break;
            case "l":
                that.dx = -side1;
                Math.round(Math.random()) ? that.dy = -side2 : that.dy = side2;
                break;
            case "r":
                that.dx = side1;
                Math.round(Math.random()) ? that.dy = -side2 : that.dy = side2;
                break;
        }
    }
    update() {
        let that = this.snowFlake;
        // if out of bounds move to random position on opposite side of canvas
        if (that.dx > 0 && that.x > canvas.width) {
            that.x = 0 - this.width;
            that.y = getRandomIntInclusive(0, canvas.height - that.y);
        }
        else if (that.dx < 0 && that.x < 0 - this.width) {
            that.x = canvas.width;
            that.y = getRandomIntInclusive(0, canvas.height - that.y);
        }
        if (that.y > canvas.height) {
            that.y = 0 - this.height;
            that.x = getRandomIntInclusive(0, canvas.width - that.x);
        } else if (this.y < 0 && that.y < 0 - this.height) {
            that.y = canvas.height;
            that.x = getRandomIntInclusive(0, canvas.width - that.x);
        }
        that.x += that.dx;
        that.y += this.snowFlake.dy;
    }
}

// creates instances of snowflakes and pushes them into an array
async function generateSnowFlakes(number, sizes, images, opacity, velocity) {
    for (let i = 0; i < number; i++) {

        let x = Math.floor(Math.random() * canvas.width);
        let y = Math.floor(Math.random() * canvas.height);

        let size;
        if (sizes.differentSizes) {
            size = getRandomIntInclusive(sizes.min, sizes.max);
        } else {
            size = sizes.value;
        }

        let imageUrl = images[Math.floor(Math.random() * images.length)];
        
        let oPacity;
        if (opacity.random) {
            oPacity = Math.ceil(Math.random() * 100) / 100;
        } else {
            oPacity = opacity.value;
        }
        
        // makes image object
        let snowFlake = new Snowflake(x, y, size);
        snowFlake.src = imageUrl;
        snowFlake.style.opacity = oPacity;
        snowFlake.giveDirection(velocity);
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
        let { x, y, size } = snowFlakes[i].snowFlake;
        ctx.globalAlpha = snowFlakes[i].style.opacity;
        ctx.drawImage(snowFlakes[i], 0, 0, snowFlakes[i].width, snowFlakes[i].height, x, y, size, size);
        snowFlakes[i].update();
    }
    requestAnimationFrame(draw);
}

// begins the snow effect
window.letItSnow = async function(divId, configUrl) {

    let params;

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
    const { number, images, opacity, sizes, velocity } = params.snowFlakes;
    await generateSnowFlakes(number, sizes, images, opacity, velocity);
    draw();
}