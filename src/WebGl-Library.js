/**
 * JavaScript Library for simple 3d Objects using WebGl
 * @constructor
 * @param {Canvas} canvas
 */
function WebGlContext(canvas) {
    this.canvas = canvas;
    this.c = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    this.c.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.textureUnit = -1;

    this.elements = [];

    /**
     * A sub-object with helpful matrix math functions
     * @type {{}}
     */
    this.MatrixMath = {
        /**
         * Generates a translation matrix
         * @param {number} tx 
         * @param {number} ty 
         * @param {number} tz 
         * @returns {Array<number>}
         */
        translation: function (tx, ty, tz) {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                tx, ty, tz, 1,
            ];
        },

        /**
         * Generates a rotation matrix (rotation around x-axis)
         * @param {number} angleInRadians 
         * @returns {Array<Number>}
         */
        xRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                1, 0, 0, 0,
                0, c, s, 0,
                0, -s, c, 0,
                0, 0, 0, 1,
            ];
        },

        /**
         * Generates a rotation matrix (rotation around y-axis)
         * @param {number} angleInRadians 
         * @returns {Array<Number>}
         */
        yRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                c, 0, -s, 0,
                0, 1, 0, 0,
                s, 0, c, 0,
                0, 0, 0, 1,
            ];
        },

        /**
         * Generates a rotation matrix (rotation around z-axis)
         * @param {number} angleInRadians 
         * @returns {Array<Number>}
         */
        zRotation: function (angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);

            return [
                c, s, 0, 0,
                -s, c, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1,
            ];
        },

        /**
         * Generates a scaling matrix
         * @param {number} sx 
         * @param {number} sy 
         * @param {number} sz 
         * @returns {Array<number>}
         */
        scaling: function (sx, sy, sz) {
            return [
                sx, 0, 0, 0,
                0, sy, 0, 0,
                0, 0, sz, 0,
                0, 0, 0, 1,
            ];
        },

        /**
         * Generates a matrix by multiplying 2 matricies
         * @param {Array<Number>} a 
         * @param {Array<Number>} b 
         * @returns {Array<Number>}
         */
        mult: function (a, b) {
            var b00 = b[0 * 4 + 0];
            var b01 = b[0 * 4 + 1];
            var b02 = b[0 * 4 + 2];
            var b03 = b[0 * 4 + 3];
            var b10 = b[1 * 4 + 0];
            var b11 = b[1 * 4 + 1];
            var b12 = b[1 * 4 + 2];
            var b13 = b[1 * 4 + 3];
            var b20 = b[2 * 4 + 0];
            var b21 = b[2 * 4 + 1];
            var b22 = b[2 * 4 + 2];
            var b23 = b[2 * 4 + 3];
            var b30 = b[3 * 4 + 0];
            var b31 = b[3 * 4 + 1];
            var b32 = b[3 * 4 + 2];
            var b33 = b[3 * 4 + 3];
            var a00 = a[0 * 4 + 0];
            var a01 = a[0 * 4 + 1];
            var a02 = a[0 * 4 + 2];
            var a03 = a[0 * 4 + 3];
            var a10 = a[1 * 4 + 0];
            var a11 = a[1 * 4 + 1];
            var a12 = a[1 * 4 + 2];
            var a13 = a[1 * 4 + 3];
            var a20 = a[2 * 4 + 0];
            var a21 = a[2 * 4 + 1];
            var a22 = a[2 * 4 + 2];
            var a23 = a[2 * 4 + 3];
            var a30 = a[3 * 4 + 0];
            var a31 = a[3 * 4 + 1];
            var a32 = a[3 * 4 + 2];
            var a33 = a[3 * 4 + 3];

            return [
                b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
            ];
        },

        /**
         * Generates an orthographic projection matrix
         * @param {number} left 
         * @param {number} right 
         * @param {number} bottom 
         * @param {number} top 
         * @param {number} near 
         * @param {number} far 
         * @returns {Array<Number>}
         */
        orthographic: function (left, right, bottom, top, near, far) {
            return [
                2 / (right - left), 0, 0, 0,
                0, 2 / (top - bottom), 0, 0,
                0, 0, 2 / (near - far), 0,

                (left + right) / (left - right),
                (bottom + top) / (bottom - top),
                (near + far) / (near - far),
                1,
            ];
        },

        /**
         * Generates an perspective projection matrix
         * @param {number} fieldOfViewInRadians 
         * @param {numer} aspect 
         * @param {number} near 
         * @param {number} far 
         * @returns {Array<Number>}
         */
        perspective: function (fieldOfViewInRadians, aspect, near, far) {
            var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
            var rangeInv = 1.0 / (near - far);

            return [
                f / aspect, 0, 0, 0,
                0, f, 0, 0,
                0, 0, (near + far) * rangeInv, -1,
                0, 0, near * far * rangeInv * 2, 0
            ];
        }
    };

    /**
     * Adjusts the context so it renders properly to the canvas (shouldn't be called when target is not canvas)
     */
    this.adjustScreen = function () {
        this.c = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.c.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Sets the clear/backround-color
     * @param {number} r red
     * @param {number} g green
     * @param {number} b blue
     * @param {number} a alpha
     */
    this.clearColor = function (r, g, b, a) {
        this.c.clearColor(r, g, b, a);
    }

    /**
     * Enables depthtesting
     */
    this.enableDepthtest = function () {
        this.c.enable(this.c.DEPTH_TEST);
    }

    /**
     * Disables depthtesting
     */
    this.disableDepthtest = function () {
        this.c.disable(this.c.DEPTH_TEST);
    }

    /**
     * Enables cullface
     */
    this.enableCullface = function () {
        this.c.enable(this.c.CULL_FACE);
    }

    /**
     * Disables cullface
     */
    this.disableCullface = function () {
        this.c.disable(this.c.CULL_FACE);
    }

    /**
     * Clears the target
     */
    this.clear = function () {
        this.c.clear(this.c.COLOR_BUFFER_BIT);
        this.c.clear(this.c.DEPTH_BUFFER_BIT);
    }


    /**
     * Creates a JSON with the needed information for an attribute used by the vertexshader
     * @param {String} name 
     * @param {number} size 
     * @returns {{}}
     */
    this.createAttribute = function (name, size) {
        return {
            name: name,
            size: size
        }
    }

    /**
     * Creates a JSON with the needed information for an uniform used by the shaders
     * @param {String} name 
     * @param {String} type 
     * @returns {{}}
     */
    this.createUniform = function (name, type) {
        if (type == "sampler2D") {
            this.textureUnit += 1;
            return {
                name: name,
                type: type,
                width: 0,
                height: 0,
                data: null,
                texture: this.c.createTexture(),
                value: this.textureUnit
            };
        } else if(type == "samplerCube"){
            this.textureUnit += 1;
            return {
                name: name,
                type: type,
                width: 0,
                height: 0,
                data: null,
                texture: this.c.createTexture(),
                value: this.textureUnit
            };
        } else {
            return {
                name: name,
                type: type,
                value: null
            }
        }
    }

    /**
     * Sets the texture of an uniform (smapler2D) to an image
     * @param {{}} uniform 
     * @param {String} imageUrl 
     */
    this.setTextureToImage = function (uniform, imageUrl) {
        var image = new Image();
        if ((new URL(imageUrl, window.location.href)).origin !== window.location.origin) {
            image.crossOrigin = "";
        }
        image.src = imageUrl;
        image.c = this.c;
        image.uniform = uniform;
        
        image.onload = function(){
            this.uniform.width = this.width;
            this.uniform.height = this.height;
            this.c.bindTexture(this.c.TEXTURE_2D, this.uniform.texture);
            
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_S, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_T, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MIN_FILTER, this.c.NEAREST);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MAG_FILTER, this.c.NEAREST);

            this.c.texImage2D(this.c.TEXTURE_2D, 0, this.c.RGBA, this.c.RGBA, this.c.UNSIGNED_BYTE, image);
        }
    }

    /**
     * Sets the texture of an uniform (smapler2D) to supplied data
     * @param {{}} uniform 
     * @param {number} width 
     * @param {number} height 
     * @param {Array<Number>} data RGBA integer values [0;255]
     */
    this.setTexture = function (uniform, width, height, data){
        this.c.bindTexture(this.c.TEXTURE_2D, uniform.texture);

        this.c.pixelStorei(this.c.UNPACK_ALIGNMENT, 1);
        uniform.width = width;
        uniform.height = height;
        if(data === null){
            this.c.texImage2D(this.c.TEXTURE_2D, 0, this.c.RGBA, width, height, 0, this.c.RGBA, this.c.UNSIGNED_BYTE, null);
        }else{
            this.c.texImage2D(this.c.TEXTURE_2D, 0, this.c.RGBA, width, height, 0, this.c.RGBA, this.c.UNSIGNED_BYTE, new Uint8Array(data));
        }
        

        this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MIN_FILTER, this.c.NEAREST);
        this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MAG_FILTER, this.c.NEAREST);
        this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_S, this.c.CLAMP_TO_EDGE);
        this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_T, this.c.CLAMP_TO_EDGE);
    }

    /**
     * Sets the texture of a side of an uniform (smaplerCube) to an image
     * @param {{}} uniform 
     * @param {String} side <+/-><x/y/z>
     * @param {String} imageUrl 
     */
    this.setCubeSideToImage = function(uniform, side, imageUrl){        
        var image = new Image();
        if ((new URL(imageUrl, window.location.href)).origin !== window.location.origin) {
            image.crossOrigin = "";
        }
        image.src = imageUrl;
        image.c = this.c;
        image.side = side;
        image.uniform = uniform;
        
        image.onload = function(){
            this.uniform.width = this.width;
            this.uniform.height = this.height;
            this.c.bindTexture(this.c.TEXTURE_CUBE_MAP, this.uniform.texture);
            
            this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_WRAP_S, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_WRAP_T, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_MIN_FILTER, this.c.NEAREST);
            this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_MAG_FILTER, this.c.NEAREST);

            var target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
            var s = side.toLocaleLowerCase();
            switch(s){
                case "x":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
                    break;
                case "+x":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
                    break;
                case "-x":
                    target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_X;
                    break;
                case "y":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Y;
                    break;
                case "+y":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Y;
                    break;
                case "-y":
                    target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_Y;
                    break;
                case "z":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Z;
                    break;
                case "+z":
                    target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Z;
                    break;
                case "-z":
                    target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_Z;
                    break;
            }

            this.c.texImage2D(target, 0, this.c.RGBA, this.c.RGBA, this.c.UNSIGNED_BYTE, this);
        }
    }

    /**
     * Sets the texture of a side of an uniform (smaplerCube) to supplied data
     * @param {{}} uniform 
     * @param {String} side <+/-><x/y/z>
     * @param {number} width 
     * @param {Array<Number>} data 
     */
    this.setCubeSide = function(uniform, side, width, height, data){        
        this.c.bindTexture(this.c.TEXTURE_CUBE_MAP, uniform.texture);

        this.c.pixelStorei(this.c.UNPACK_ALIGNMENT, 1);
        
        if(uniform.width != 0 && uniform.height != 0){
            if(width != uniform.width || height != uniform.height){
                console.log("textures in samplerCube need to be of same size!");
            }
        }else{
            uniform.width = width;
            uniform.height = height;
        }
        
        var target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
        var s = side.toLocaleLowerCase();
        switch(s){
            case "x":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
                break;
            case "+x":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_X;
                break;
            case "-x":
                target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_X;
                break;
            case "y":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Y;
                break;
            case "+y":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Y;
                break;
            case "-y":
                target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_Y;
                break;
            case "z":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Z;
                break;
            case "+z":
                target = this.c.TEXTURE_CUBE_MAP_POSITIVE_Z;
                break;
            case "-z":
                target = this.c.TEXTURE_CUBE_MAP_NEGATIVE_Z;
                break;
        }

        this.c.texImage2D(target, 0, this.c.RGBA, width, height, 0, this.c.RGBA, this.c.UNSIGNED_BYTE, new Uint8Array(data));

        this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_MIN_FILTER, this.c.NEAREST);
        this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_MAG_FILTER, this.c.NEAREST);
        this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_WRAP_S, this.c.CLAMP_TO_EDGE);
        this.c.texParameteri(this.c.TEXTURE_CUBE_MAP, this.c.TEXTURE_WRAP_T, this.c.CLAMP_TO_EDGE);
    }

    /**
     * Creates a JSON with the needed information for a Camera
     * @returns {{}}
     */
    this.createCamera = function () {
        return {
            x: 0,
            y: 0,
            z: 0,
            xRotation: 0,
            yRotation: 0,
            zRotation: 0,
            projectionMatrix: this.MatrixMath.orthographic(-1, 1, -1, 1, -1, 1)
        }
    }

    /**
     * Creates a JSON with the needed information for an Element
     * @returns {{}}
     */
    this.createElement = function () {
        return {
            program: null,
            x: 0,
            y: 0,
            z: 0,
            xRotation: 0,
            yRotation: 0,
            zRotation: 0,
            attributes: [],
            uniforms: [],
            vertices: [],
            indicies: [],
            camera: this.createCamera()
        }
    }

    /**
     * Compiles the vertex and fragment shader and adds them to the element
     * @param {{}} element 
     * @param {String} vertexShaderSrc 
     * @param {String} fragmentShaderSrc 
     */
    this.addShaders = function (element, vertexShaderSrc, fragmentShaderSrc) {
        element.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
    }

    /**
     * Adds the element to the internal list of elements so it can be easily rendered using renderFrame()
     * @param {{}} element 
     */
    this.addElement = function(element){
        if(!this.elements.includes(element)){
            this.elements.push(element);
        }
    }

    /**
     * Removes the element from the internal list of elements so it won't be rendered using renderFrame()
     * @param {{}} element 
     * @returns {boolean}
     */
    this.removeElement = function(element){
        var index = this.elements.indexOf(element);
        if(index != -1){
            this.elements.splice(index, 1);
            return true;
        }else{
            return false;
        }
    }

    /**
     * Renders an specific element to the target (usually canvas)
     * @param {{}} element 
     */
    this.renderElement = function (element) {
        this.c.useProgram(element.program);
        this.createBuffers(element.program, element.vertices, element.attributes, element.indicies);

        for (var i = 0; i < element.uniforms.length; i++) {
            var uniformLocation = this.c.getUniformLocation(element.program, element.uniforms[i].name);
            var uniform = element.uniforms[i].value;

            switch (element.uniforms[i].type) {
                case "float":
                    this.c.uniform1f(uniformLocation, uniform);
                    break;
                case "vec2":
                    this.c.uniform2fv(uniformLocation, new Float32Array(uniform));
                    break;
                case "vec3":
                    this.c.uniform3fv(uniformLocation, new Float32Array(uniform));
                    break;
                case "vec4":
                    this.c.uniform4fv(uniformLocation, new Float32Array(uniform));
                    break;
                case "mat2":
                    this.c.uniformMatrix2fv(uniformLocation, this.c.FALSE, new Float32Array(uniform));
                    break;
                case "mat3":
                    this.c.uniformMatrix3fv(uniformLocation, this.c.FALSE, new Float32Array(uniform));
                    break;
                case "mat4":
                    this.c.uniformMatrix4fv(uniformLocation, this.c.FALSE, new Float32Array(uniform));
                    break;
                case "int":
                    this.c.uniform1i(uniformLocation, uniform);
                    break;
                case "ivec2":
                    this.c.uniform2iv(uniformLocation, new Int32Array(uniform));
                    break;
                case "ivec3":
                    this.c.uniform3iv(uniformLocation, new Int32Array(uniform));
                    break;
                case "ivec4":
                    this.c.uniform4iv(uniformLocation, new Int32Array(uniform));
                    break;
                case "sampler2D":
                    this.c.uniform1i(uniformLocation, uniform);
                    this.bindTexture(element.uniforms[i], uniform);
                    break;
                case "samplerCube":
                    this.c.uniform1i(uniformLocation, uniform);
                    this.bindTexture(element.uniforms[i], uniform);
            }
        }

        var transformedMatrix = this.MatrixMath.mult(this.MatrixMath.mult(this.MatrixMath.mult(this.MatrixMath.yRotation(element.camera.yRotation), this.MatrixMath.xRotation(element.camera.xRotation)), this.MatrixMath.zRotation(element.camera.zRotation)), this.MatrixMath.translation(element.camera.x, element.camera.y, element.camera.z));
        var projectionMatrix = this.MatrixMath.mult(element.camera.projectionMatrix, transformedMatrix);
        var uniformLocation = this.c.getUniformLocation(element.program, "projectionMatrix");
        this.c.uniformMatrix4fv(uniformLocation, this.c.FALSE, new Float32Array(projectionMatrix));

        this.c.drawElements(this.c.TRIANGLES, element.indicies.length, this.c.UNSIGNED_SHORT, 0);
    }

    /**
     * Renders all elements which were added using addElement to the target (usually canvas)
     */
    this.renderFrame = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.renderElement(this.elements[i]);
        }
    }

    /**
     * Sets a new target to render to and unbinds all textures so an texture is not used as input and output at once. Default target is canvas. To render to canvas pass null as an parameter.
     * @param {{}} uniformTexture 
     */
    this.setTarget = function(uniformTexture){
        if(uniformTexture === null){
            this.c.bindFramebuffer(this.c.FRAMEBUFFER, null);
            this.c.bindRenderbuffer(this.c.RENDERBUFFER, null);
            this.adjustScreen();
        }else{
            for(var i=0;i<=this.textureUnit;i++){
                this.bindTexture(null, i);
            }
            var frameBuffer = this.c.createFramebuffer();
            this.c.bindFramebuffer(this.c.FRAMEBUFFER, frameBuffer);
            this.c.framebufferTexture2D(this.c.FRAMEBUFFER, this.c.COLOR_ATTACHMENT0, this.c.TEXTURE_2D, uniformTexture.texture, 0);

            var depthBuffer = this.c.createRenderbuffer();
            this.c.bindRenderbuffer(this.c.RENDERBUFFER, depthBuffer);
            this.c.renderbufferStorage(this.c.RENDERBUFFER, this.c.DEPTH_COMPONENT16, uniformTexture.width, uniformTexture.height);
            this.c.framebufferRenderbuffer(this.c.FRAMEBUFFER, this.c.DEPTH_ATTACHMENT, this.c.RENDERBUFFER, depthBuffer);

            this.c.viewport(0, 0, uniformTexture.width, uniformTexture.height);
        }
    }

    /**
     * Binds (or unbinds) an texture (textureId should be the value of the uniform). Unbinds texture if uniformTexture is null.
     * @param {number} textureId 
     * @param {{}} uniformTexture 
     */
    this.bindTexture = function(uniformTexture, textureId){
        if(uniformTexture === null){
            var activeTexture = this.c.TEXTURE0 + textureId;
            this.c.activeTexture(activeTexture);
            this.c.bindTexture(this.c.TEXTURE_2D, null);
        }else if(uniformTexture.type == "sampler2D"){
            var activeTexture = this.c.TEXTURE0 + uniformTexture.value;
            this.c.activeTexture(activeTexture);
            this.c.bindTexture(this.c.TEXTURE_2D, uniformTexture.texture);
        }else if(uniformTexture.type == "samplerCube"){
            var activeTexture = this.c.TEXTURE0 + uniformTexture.value;
            this.c.activeTexture(activeTexture);
            this.c.bindTexture(this.c.TEXTURE_CUBE_MAP, uniformTexture.texture);
        }
    }

    /**
     * Creates a Shader
     * @param {String} src 
     * @param {number} type 
     */
    this.createShader = function (src, type) {
        var shader = this.c.createShader(type);
        this.c.shaderSource(shader, src);
        this.c.compileShader(shader);
        if (!this.c.getShaderParameter(shader, this.c.COMPILE_STATUS)) {
            console.log(this.c.getShaderInfoLog(shader));
            return null;
        } else {
            return shader;
        }
    }

    /**
     * Creates a ShaderProgram
     * @param {String} vertexShaderSrc 
     * @param {String} fragmentShaderSrc 
     */
    this.createProgram = function (vertexShaderSrc, fragmentShaderSrc) {
        var vertexShader = this.createShader(vertexShaderSrc, this.c.VERTEX_SHADER);
        var fragmentShader = this.createShader(fragmentShaderSrc, this.c.FRAGMENT_SHADER);
        if (vertexShader === null || fragmentShader === null) {
            return null;
        }
        var program = this.c.createProgram();
        this.c.attachShader(program, vertexShader);
        this.c.attachShader(program, fragmentShader);
        this.c.linkProgram(program);
        if (!this.c.getProgramParameter(program, this.c.LINK_STATUS)) {
            console.log(this.c.getProgramInfoLog(program));
            return null;
        } else {
            return program;
        }
    }

    /**
     * Creates the neccecary buffers for an render-call
     * @param {Program} program 
     * @param {Array<Number>} vertices 
     * @param {Array<{}>} attributes 
     * @param {Array<Number>} indicies 
     */
    this.createBuffers = function (program, vertices, attributes, indicies) {
        var vertexBuffer = this.c.createBuffer();
        this.c.bindBuffer(this.c.ARRAY_BUFFER, vertexBuffer);
        this.c.bufferData(this.c.ARRAY_BUFFER, new Float32Array(vertices), this.c.DYNAMIC_DRAW);

        var indexBuffer = this.c.createBuffer();
        this.c.bindBuffer(this.c.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.c.bufferData(this.c.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicies), this.c.DYNAMIC_DRAW);

        var size = 0;
        for (var i = 0; i < attributes.length; i++) {
            size += attributes[i].size;
        }

        var offset = 0;
        for (var i = 0; i < attributes.length; i++) {
            var attibLocation = this.c.getAttribLocation(program, attributes[i].name);
            this.c.vertexAttribPointer(attibLocation, attributes[i].size, this.c.FLOAT, this.c.FALSE, size * Float32Array.BYTES_PER_ELEMENT, offset * Float32Array.BYTES_PER_ELEMENT);
            this.c.enableVertexAttribArray(attibLocation);

            offset += attributes[i].size;
        }
    }
}