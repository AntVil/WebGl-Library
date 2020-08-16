var can
var c;


var element1;
var element2;

var frame = 0;

function adjustScreen() {
    can = document.getElementById("canvas");
    can.width = Math.min(window.innerWidth, window.innerHeight);
    can.height = can.width;
    if(c === undefined){
        c = new WebGlContext(can);
    }else{
        c.adjustScreen();
    }
}

window.onresize = function () {
    adjustScreen();
}

window.onload = function () {
    adjustScreen();

    c.clearColor(0.0, 0.0, 0.0, 0.0);

    element1 = c.createElement();
    element1.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];
    element1.uniforms = [
        c.createUniform("texture", "sampler2D")
    ];
    c.setTextureToImage(element1.uniforms[0], "DogPicture.jpeg");

    element1.vertices = [
        -1, -0.5, 0, 1,
        0, -0.5, 1, 1,
        -1, 0.5, 0, 0,
        0, 0.5, 1, 0
    ];
    element1.indicies = [
        0, 1, 2,
        2, 1, 3
    ];

    var vertexShaderSrc = document.getElementById("vertexShaderElement1").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement1").innerHTML;
    c.addElement(element1, vertexShaderSrc, fragmentShaderSrc);


    element2 = c.createElement();
    element2.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];
    element2.uniforms = [
        element1.uniforms[0]
    ];

    element2.vertices = [
        0, -0.5, 0, 1,
        1, -0.5, 1, 1,
        0, 0.5, 0, 0,
        1, 0.5, 1, 0
    ];
    element2.indicies = [
        0, 1, 2,
        2, 1, 3
    ];

    var vertexShaderSrc = document.getElementById("vertexShaderElement2").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement2").innerHTML;
    c.addElement(element2, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop() {
    c.clear();

    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}