var can
var c;

var element;

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

    //setting the background color to black
    c.clearColor(0.0, 0.0, 0.0, 1.0);

    //creating an element and giving it all the needed information 
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

    element.indicies = [0, 1, 2];

    //adding shaders to element and adding element to the internal list of elements
    var vertexShaderSrc = document.getElementById("vertexShader").innerHTML;
    var fragmentShaderSrc = document.getElementById("fragmentShader").innerHTML;
    c.addElement(element, vertexShaderSrc, fragmentShaderSrc);

    //clear screen
    c.clear();

    //render to screen
    c.renderFrame();
}