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

    c.enableDepthtest();
    c.enableCullface();
    c.clearColor(0.0, 0.0, 0.0, 0.0);

    element = c.createElement();

    element.attributes = [
        c.createAttribute("vertPosition", 2)
    ];

    element.uniforms = [
        c.createUniform("rotationMatrix", "mat4")
    ];

    element.vertices = [
        -1, -1, -1,
        -1, -1, 1,
        -1, 1, -1,
        -1, 1, 1,
        1, -1, -1,
        1, -1, 1,
        1, 1, -1,
        1, 1, 1
    ];

    element.indicies = [
        0, 1, 2,
        1, 3, 2,

        0, 1, 4,
        1, 5, 4,

        0, 2, 4,
        2, 6, 4,

        1, 3, 5,
        3, 5, 7,

        2, 3, 6,
        3, 6, 7,

        4, 5, 6,
        5, 7, 6,
    ];

    var vertexShaderSrc = document.getElementById("vertexShader").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShader").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop(){
    c.clear();

    element.uniforms[0].value = c.MatrixMath.yRotation(frame/100);

    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}