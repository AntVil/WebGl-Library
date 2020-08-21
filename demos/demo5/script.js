var can
var c;

var element;

var frame = 0;

function adjustScreen() {
    can = document.getElementById("canvas");
    can.width = Math.min(window.innerWidth, window.innerHeight);
    can.height = can.width;
    if (c === undefined) {
        c = new WebGlContext(can);
    } else {
        c.adjustScreen();
    }
}

window.onresize = function () {
    adjustScreen();
}

window.onload = function () {
    adjustScreen();

    c.clearColor(0, 0, 0, 1);

    element = c.createElement();
    element.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];
    element.uniforms = [
        c.createUniform("texture0", "sampler2D"),
        c.createUniform("texture1", "sampler2D"),
    ];
    c.setTextureToImage(element.uniforms[0], "DogPicture.jpeg");

    element.vertices = [
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        1, 1, 1, 0
    ];
    element.indicies = [
        0, 1, 2,
        2, 1, 3
    ];

    var vertexShaderSrc = document.getElementById("vertexShaderElement").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement").innerHTML;
    c.addShaders(element, vertexShaderSrc, fragmentShaderSrc);
    c.addElement(element);

    c.clear();

    frame = 0;
    loop();
}

function loop() {
    c.clear();

    var width = 10;
    var height = 10;
    var data = [];
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var val = parseInt((Math.sin((i + j + frame) / 10) + 1) / 2 * 255);
            data.push(val, val, val, val);
        }
    }
    c.setTexture(element.uniforms[1], width, height, data);
    
    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}