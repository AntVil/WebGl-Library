var can
var c;

var screenUniform;

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

    element.camera.projectionMatrix = c.MatrixMath.perspective(Math.PI/2, 1, 0.1, 1000);
    element.camera.z = -2;

    var vertexShaderSrc = document.getElementById("vertexShaderElement").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement").innerHTML;
    c.addShaders(element, vertexShaderSrc, fragmentShaderSrc);
    c.addElement(element);

    screenUniform = c.createUniform("texture", "sampler2D");
    c.setTexture(screenUniform, 255, 255, null);

    c.clear();

    frame = 0;
    loop();
}

function loop() {
    element.uniforms[1].value = c.MatrixMath.yRotation(frame / 100);

    var data = [];
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var val = parseInt((Math.sin((i + j + frame) / 10) + 1) / 2 * 255);
            data.push(val, val, val, val);
        }
    }
    c.setTexture(element.uniforms[0], 10, 10, data);
    
    c.setTarget(screenUniform);
    c.clearColor(0.1, 0.1, 0.1, 1);
    c.clear();
    c.renderFrame();


    c.setTarget(null);
    c.clearColor(0, 0, 0, 1);
    c.clear();
    
    var temp = element.uniforms[0];
    element.uniforms[0] = screenUniform;

    c.renderFrame();

    element.uniforms[0] = temp

    frame++;
    requestAnimationFrame(loop);
}