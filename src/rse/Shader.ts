
namespace rse {
    function compileShader(type:number, source:string, defines:string[]) {
        let shader = gl.createShader(type);

        let definesString = defines.map(s => '#define ' + s).join('\n');
        source = definesString + '\n' + source;
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            throw "could not compile shader:" + gl.getShaderInfoLog(shader);
        }

        return shader;
    }

    export class Shader {
        private handle:WebGLProgram;

        constructor(vertexShaderSource:string, fragmentShaderSource:string, defines:string[]) {
            let vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource, defines);
            let fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource, defines);

            this.handle = gl.createProgram();

            gl.attachShader(this.handle, vertexShader);
            gl.attachShader(this.handle, fragmentShader);

            gl.linkProgram(this.handle);

            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);

            let success = gl.getProgramParameter(this.handle, gl.LINK_STATUS);
            if (!success) {
                throw "could not link shader "  + gl.getProgramInfoLog(this.handle);
            }
        }

        setUniformInt(index:number, value:number) {
            gl.uniform1i(index, value);
        }

        setUniformFloat(index:number, value:number) {
            gl.uniform1f(index, value);
        }

        setUniformVec4(index:number, value:Vec4) {
            gl.uniform4f(index, value.x, value.y, value.z, value.w);
        }

        setUniformColor(index:number, value:Color) {
            gl.uniform4f(index, value.r / 255.0, value.g / 255.0, value.b / 255.0, value.a / 255.0);
        }
    }
}