var can
var c;

//uniform/texture to render screen to
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
    element.camera.projectionMatrix = c.MatrixMath.perspective(Math.PI/2, 1, 0.1, 1000);
    element.camera.z = -2;

    //adding shaders to element and adding element to the internal list of elements
    var vertexShaderSrc = document.getElementById("vertexShaderElement").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement").innerHTML;
    c.addShaders(element, vertexShaderSrc, fragmentShaderSrc);
    c.addElement(element);

    //creating empty (null) uniform/texture to render to
    screenUniform = c.createUniform("texture", "sampler2D");
    c.setTexture(screenUniform, 255, 255, null);

    c.clear();

    frame = 0;
    loop();
}

function loop() {
    //update uniforms
    element.uniforms[1].value = c.MatrixMath.yRotation(frame / 100);

    //creating data for texture
    var data = [];
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var val = parseInt((Math.sin((i + j + frame) / 10) + 1) / 2 * 255);
            data.push(val, val, val, val);
        }
    }
    //setting data to uniform
    c.setTexture(element.uniforms[0], 10, 10, data);
    
    //declaring to render to texture
    c.setTarget(screenUniform);
    c.clearColor(0.1, 0.1, 0.1, 1);
    c.clear();
    //render to texture
    c.renderFrame();

    //declaring to render to canvas
    c.setTarget(null);
    c.clearColor(0, 0, 0, 1);
    c.clear();
    
    //swap uniform (to use obtained texture)
    var temp = element.uniforms[0];
    element.uniforms[0] = screenUniform;

    //render to canvas
    c.renderFrame();

    //swap back so texture is not used as input ans output at the same time
    element.uniforms[0] = temp

    //restart loop
    frame++;
    requestAnimationFrame(loop);
}