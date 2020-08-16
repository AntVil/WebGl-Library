function WebGlContext(canvas) {
    this.canvas = canvas;
    this.c = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
    this.c.viewport(0, 0, this.canvas.width, this.canvas.height);

    this.textureUnit = 0;

    this.elements = [];

    this.MatrixMath = {
        //matrix-math
        translation: function (tx, ty, tz) {
            return [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                tx, ty, tz, 1,
            ];
        },

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

        scaling: function (sx, sy, sz) {
            return [
                sx, 0, 0, 0,
                0, sy, 0, 0,
                0, 0, sz, 0,
                0, 0, 0, 1,
            ];
        },

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


    this.adjustScreen = function () {
        this.c = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        this.c.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    this.clearColor = function (r, g, b, a) {
        this.c.clearColor(r, g, b, a);
    }

    this.enableDepthtest = function () {
        this.c.enable(this.c.DEPTH_TEST);
    }

    this.enableCullface = function () {
        this.c.enable(this.c.CULL_FACE);
    }

    this.clear = function () {
        this.c.clear(this.c.COLOR_BUFFER_BIT);
        this.c.clear(this.c.DEPTH_BUFFER_BIT);
    }



    this.createAttribute = function (name, size) {
        return {
            name: name,
            size: size
        }
    }

    this.createUniform = function (name, type) {
        if (type == "sampler2D") {
            this.textureUnit += 1;
            return {
                name: name,
                type: type,
                level: 0,
                width: 0,
                height: 0,
                data: new Uint8Array(),
                texture: this.c.createTexture(),
                value: this.textureUnit,
            };
        } else {
            return {
                name: name,
                type: type,
                value: null
            }
        }
    }

    this.setTextureToImage = function (uniform, imageUrl) {
        var image = new Image();
        if ((new URL(imageUrl, window.location.href)).origin !== window.location.origin) {
            image.crossOrigin = "";
        }
        image.src = imageUrl;
        image.c = this.c;
        
        image.onload = function(){
            this.c.bindTexture(this.c.TEXTURE_2D, uniform.texture);
            
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_S, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_WRAP_T, this.c.CLAMP_TO_EDGE);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MIN_FILTER, this.c.NEAREST);
            this.c.texParameteri(this.c.TEXTURE_2D, this.c.TEXTURE_MAG_FILTER, this.c.NEAREST);

            this.c.texImage2D(this.c.TEXTURE_2D, 0, this.c.RGBA, this.c.RGBA, this.c.UNSIGNED_BYTE, image);
        }
    }

    this.setTexture = function (uniform, width, height, data){
        this.c.bindTexture(this.c.TEXTURE_2D, uniform.texture);
        this.c.pixelStorei(this.c.UNPACK_ALIGNMENT, 1);
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

    this.addElement = function (element, vertexShaderSrc, fragmentShaderSrc) {
        element.program = this.createProgram(vertexShaderSrc, fragmentShaderSrc);
        this.elements.push(element);
    }

    this.renderElement = function (element) {
        this.c.useProgram(element.program);
        this.createBuffers(element.program, element.vertices, element.attributes, element.indicies);

        for (var i = 0; i < element.uniforms.length; i++) {
            var uniformLocation = this.c.getUniformLocation(element.program, element.uniforms[i].name);
            var uniform = element.uniforms[i].value;

            switch (element.uniforms[i].type) {
                case "float":
                    this.c.uniform1fv(uniformLocation, [v]);
                    break;
                case "vec2":
                    this.c.uniform2fv(uniformLocation, [v0, v1]);
                    break;
                case "vec3":
                    this.c.uniform3fv(uniformLocation, [v0, v1, v2]);
                    break;
                case "vec4":
                    this.c.uniform4fv(uniformLocation, [v0, v1, v2, v4]);
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
                    this.c.uniform1iv(uniformLocation, [v]);
                    break;
                case "ivec2":
                    this.c.uniform2iv(uniformLocation, [v0, v1]);
                    break;
                case "ivec3":
                    this.c.uniform3iv(uniformLocation, [v0, v1, v2]);
                    break;
                case "ivec4":
                    this.c.uniform4iv(uniformLocation, [v0, v1, v2, v4]);
                    break;
                case "sampler2D":
                    this.c.uniform1i(uniformLocation, new Float32Array(uniform));
                    break;
                case "samplerCube":
                    this.c.uniform1iv(uniformLocation, [v]);
            }
        }

        var transformedMatrix = this.MatrixMath.mult(this.MatrixMath.mult(this.MatrixMath.mult(this.MatrixMath.yRotation(element.camera.yRotation), this.MatrixMath.xRotation(element.camera.xRotation)), this.MatrixMath.zRotation(element.camera.zRotation)), this.MatrixMath.translation(element.camera.x, element.camera.y, element.camera.z));
        var projectionMatrix = this.MatrixMath.mult(element.camera.projectionMatrix, transformedMatrix);
        var uniformLocation = this.c.getUniformLocation(element.program, "projectionMatrix");
        this.c.uniformMatrix4fv(uniformLocation, this.c.FALSE, new Float32Array(projectionMatrix));

        this.c.drawElements(this.c.TRIANGLES, element.indicies.length, this.c.UNSIGNED_SHORT, 0);
    }

    this.renderFrame = function () {
        for (var i = 0; i < this.elements.length; i++) {
            this.renderElement(this.elements[i]);
        }
    }

    this.renderElementToTexture = function (element, uniformTexture) {
        var frameBuffer = this.c.createFrameBuffer();
        this.c.bindFramebuffer(this.c.FRAMEBUFFER, frameBuffer);
        this.c.framebufferTexture2D(this.c.FRAMEBUFFER, this.c.COLOR_ATTACHMENT0, this.c.TEXTURE_2D, uniformTexture.texture, 0);

        var depthBuffer = this.c.createRenderbuffer();
        this.c.bindRenderbuffer(this.c.RENDERBUFFER, depthBuffer);
        this.c.renderbufferStorage(this.c.RENDERBUFFER, this.c.DEPTH_COMPONENT16, uniformTexture.width, uniformTexture.height);
        this.c.framebufferRenderbuffer(this.c.FRAMEBUFFER, this.c.DEPTH_ATTACHMENT, this.c.RENDERBUFFER, depthBuffer);

        this.c.viewport(0, 0, uniformTexture.width, uniformTexture.height);

        this.renderElement(element);

        this.c.bindFramebuffer(this.c.FRAMEBUFFER, null);
        this.adjustScreen();
    }

    this.renderFrameToTexture = function (uniformTexture) {
        var frameBuffer = this.c.createFrameBuffer();
        this.c.bindFramebuffer(this.c.FRAMEBUFFER, frameBuffer);
        this.c.framebufferTexture2D(this.c.FRAMEBUFFER, this.c.COLOR_ATTACHMENT0, this.c.TEXTURE_2D, uniformTexture.texture, 0);

        var depthBuffer = this.c.createRenderbuffer();
        this.c.bindRenderbuffer(this.c.RENDERBUFFER, depthBuffer);
        this.c.renderbufferStorage(this.c.RENDERBUFFER, this.c.DEPTH_COMPONENT16, uniformTexture.width, uniformTexture.height);
        this.c.framebufferRenderbuffer(this.c.FRAMEBUFFER, this.c.DEPTH_ATTACHMENT, this.c.RENDERBUFFER, depthBuffer);

        this.c.viewport(0, 0, uniformTexture.width, uniformTexture.height);

        this.renderFrame();

        this.c.bindFramebuffer(this.c.FRAMEBUFFER, null);
        this.adjustScreen();
    }



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