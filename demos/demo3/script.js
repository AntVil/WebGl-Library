var can
var c;


var element;

var frame = 0;

function adjustScreen() {
    can = document.getElementById("canvas");
    can.width = Math.min(window.innerWidth, window.innerHeight);
    can.height = can.width;
    c = new WebGlContext(can);
}

window.onresize = function () {
    adjustScreen();
}

window.onload = function () {
    adjustScreen();

    c.clearColor(0.0, 0.0, 0.0, 0.0);

    element = c.createElement();

    element.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];

    element.uniforms = [
        c.createUniform("texture", "sampler2D")
    ];

    

    c.setTextureToImage(element.uniforms[0], "DogPicture.jpeg");

    

    element.vertices = [
        -1, -1, 0, 0,
        1, -1, 1, 0,
        -1, 1, 0, 1,
        1, 1, 1, 1
    ];

    element.indicies = [
        0, 1, 2,
        2, 1, 3
    ];

    var vertexShaderSrc = document.getElementById("vertexShader").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShader").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop() {
    c.clear();



    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}