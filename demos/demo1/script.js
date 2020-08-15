var can
var c;

var element;

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
        c.createAttribute("vertColor", 3)
    ];

    element.vertices = [
        0.0, 0.25, 1.0, 0.0, 0.0,
        0.5, -0.25, 0.0, 1.0, 0.0,
        -0.5, -0.25, 0.0, 0.0, 1.0
    ];

    element.indicies = [1, 2, 3];

    var vertexShaderSrc = document.getElementById("vertexShader").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShader").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    c.clear();

    c.renderFrame();
}