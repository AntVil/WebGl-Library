var can
var c;

var element;

var frame;

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

    //setting background color to black
    c.clearColor(0, 0, 0, 1);

    //creating element and giving it all the needed information 
    element = c.createElement();
    element.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];
    element.uniforms = [
        c.createUniform("texture", "sampler2D"),
        c.createUniform("rotationMatrix", "mat4")
    ];

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

    //setting an other projectionMatrix than default one
    element.camera.projectionMatrix = c.MatrixMath.perspective(Math.PI / 2, 1, 0.1, 1000);
    element.camera.z = -2;

    //adding shaders to element and adding element to the internal list of elements
    var vertexShaderSrc = document.getElementById("vertexShaderElement").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop() {
    c.clear();

    //creating data for texture
    var width = 10;
    var height = 10;
    var data = [];
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var val = parseInt((Math.sin((i + j + frame) / 10) + 1) / 2 * 255);
            data.push(val, val, val, val);
        }
    }
    //setting data to uniform
    c.setTexture(element.uniforms[0], width, height, data);

    //update uniforms
    element.uniforms[1].value = c.MatrixMath.yRotation(frame / 100);

    //render to screen
    c.renderFrame();

    //restart loop
    frame++;
    requestAnimationFrame(loop);
}