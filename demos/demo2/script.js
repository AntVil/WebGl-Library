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

    //enable Depthtest and Cullface, so the Cube is rendered properly
    c.enableDepthtest();
    c.enableCullface();

    //setting background color to black
    c.clearColor(0, 0, 0, 1);

    //creating element and giving it all the needed information 
    element = c.createElement();
    element.attributes = [
        c.createAttribute("vertPosition", 3)
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

        0, 4, 1,
        1, 4, 5,

        0, 2, 4,
        2, 6, 4,

        1, 5, 3,
        3, 5, 7,

        2, 3, 6,
        3, 7, 6,

        4, 6, 5,
        5, 6, 7,
    ];

    //setting an other projectionMatrix than default one
    element.camera.projectionMatrix = c.MatrixMath.perspective(Math.PI / 2, 1, 0.1, 1000);
    element.camera.z = -3;

    //adding shaders to element and adding element to the internal list of elements
    var vertexShaderSrc = document.getElementById("vertexShader").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShader").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop() {
    //clear screen
    c.clear();

    //update uniforms
    element.uniforms[0].value = c.MatrixMath.mult(c.MatrixMath.yRotation(frame / 100), c.MatrixMath.xRotation(frame / 300));

    //render to screen
    c.renderFrame();

    //restart loop
    frame++;
    requestAnimationFrame(loop);
}