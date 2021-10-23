// ------- canvas -------
let canvas;
let ctx;
function initializeCanvas(div) {
    const container = document.getElementById(div);
    canvas = document.createElement("canvas");
    container.appendChild(canvas);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx = canvas.getContext("2d");

}

// -------- particles -------

let snowFlakes = [];
// class for generating snowflakes
class SnowFlake {
    constructor(imageUrl, size, color, opacity) {
        this.imageUrl = imageUrl,
        this.size = size
        this.color = color,
        this.opacity = opacity
    }
}
// creates instances of snowflakes and pushes them into an array
function generateSnowFlakes(number, images, colors, opacity, sizes) {
    let url = window.location.hostname;
    for (let i = 0; i < number; i++) {
        let imageUrl = url + images[Math.floor(Math.random() * images.length)];
        let color = colors[Math.floor(Math.random() * colors.length)]
        let oPacity;
        if (opacity.random) {
            oPacity = Math.random().toFixed(2);
        } else {
            oPacity = opacity.value;
        }
        let size;
        if (sizes.differentSizes) {
            size = Math.floor(Math.random() * sizes.max) + sizes.min;
        } else {
            size = sizes.value;
        }
        snowFlakes.push(new SnowFlake(imageUrl, size, color, oPacity, size));
    }
}
// ------- drawing to canvas -------

function draw() {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(50, 50, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    requestAnimationFrame(draw);
}

// begins the snow effect
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

    const { number, images, colors, opacity, sizes } = params.particles;
    generateSnowFlakes(number, images, colors, opacity, sizes);
    // look up breakout game for further progress...
    draw();
}

let url = "/letItSnow.json";
window.letItSnow("snowFlakesJS", url);