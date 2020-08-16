var can
var c;

var element;

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

    element = c.createElement();
    element.attributes = [
        c.createAttribute("vertPosition", 2),
        c.createAttribute("texturePosition", 2),
    ];
    element.uniforms = [
        c.createUniform("texture", "sampler2D"),
        c.createUniform("projectionMatrix", "mat4")
    ];
    c.setTextureToImage(element.uniforms[0], "DogPicture.jpeg");

    element.vertices = [
        -0.5, -0.5, 0, 1,
        0.5, -0.5, 1, 1,
        -0.5, 0.5, 0, 0,
        0.5, 0.5, 1, 0
    ];
    element.indicies = [
        0, 1, 2,
        2, 1, 3
    ];

    var vertexShaderSrc = document.getElementById("vertexShaderElement").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShaderElement").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    frame = 0;
    loop();
}

function loop() {
    c.clear();

    var array = [];
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            var val = Math.sin((i + j + frame)/100);
            array.push(val, val, val, val);
        }
    }

    c.setTexture(element.uniforms[0], 10, 10, array);
    element.uniforms[1] = c.MatrixMath.yRotation(frame/300);

    c.renderFrame();

    frame++;
    requestAnimationFrame(loop);
}