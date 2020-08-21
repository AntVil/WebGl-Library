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
        c.createUniform("texture1", "sampler2D"),
        c.createUniform("texture2", "sampler2D"),
    ];
    c.setTextureToImage(element.uniforms[1], "DogPicture.jpeg")
    c.bindTexture(element.uniforms[0]);
    c.bindTexture(element.uniforms[1]);

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

    element.camera.projectionMatrix = c.MatrixMath.perspective(Math.PI/2, 1, 0.1, 1000);
    element.camera.z = -2;

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

    var data = [];
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var val = parseInt((Math.sin((i + j + frame) / 10) + 1) / 2 * 255);
            data.push(val, val, val, val);
        }
    }
    c.setTexture(element.uniforms[0], 10, 10, data);

    
    
    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}