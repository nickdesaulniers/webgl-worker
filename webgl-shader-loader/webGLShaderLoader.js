var WebGLShaderLoader = (function () {
  var scope = this;
  var vertexShaderType = WebGLRenderingContext.prototype.VERTEX_SHADER;
  var fragmentShaderType = WebGLRenderingContext.prototype.FRAGMENT_SHADER;

  function WebGLShaderLoader (gl) {
    this.errors = [];
    if ('HTMLCanvasElement' in scope && gl instanceof HTMLCanvasElement ||
        'OffscreenCanvas' in scope && gl instanceof OffscreenCanvas) {
      this.gl = gl.getContext('webgl') || gl.getContext('experimental-webgl');
      if (!this.gl) this.errors.push("webgl unsupported");
    } else {
      this.gl = gl;
    }
    this.vertexShader = this.fragmentShader = null;
  };

  WebGLShaderLoader.prototype = {
    loadFromStr: function (vertexShaderStr, fragmentShaderStr, cb) {
      if (typeof vertexShaderStr !== "string" ||
          typeof fragmentShaderStr !== "string" ||
          typeof cb !== "function") {
        this.errors.push("Usage: loaderInstance.loadFromStr('', '', function (errors, program));");
        cb(this.errors, null, this.gl);
      } else if (vertexShaderStr.length === 0 ||
                 fragmentShaderStr.length === 0) {
        this.errors.push("empty shader string");
        cb(this.errors, null, this.gl);
      } else {
        this.vertexShader = this.compile(vertexShaderType, vertexShaderStr);
        this.fragmentShader = this.compile(fragmentShaderType, fragmentShaderStr);

        cb(this.errors, this.link(), this.gl);
      }
    },
    loadFromXHR: function (vertexShaderPath, fragmentShaderPath, cb) {
      if (typeof vertexShaderPath !== "string" ||
          typeof fragmentShaderPath !== "string" ||
          typeof cb !== "function") {
        this.errors.push("Usage: loaderInstance.loadFromXHR('', '', function (errors, program));");
        cb(this.errors, null, this.gl);
        return;
      }

      if (vertexShaderPath.length === 0 || fragmentShaderPath.length === 0) {
        this.errors.push("empty shader path");
        cb(this.errors, null, this.gl);
        return;
      }

      var numShadersLoaded = 0;
      var onload = function (shader, shaderType) {
        return function (twoHundredResponse, shaderStr) {
          if (!twoHundredResponse) {
            this.errors.push("xhr non 200 response code");
            cb(this.errors, null, this.gl);
            return;
          }

          this[shader] = this.compile(shaderType, shaderStr);

          if (++numShadersLoaded > 1) {
            cb(this.errors, this.link(), this.gl);
          }
        }.bind(this);
      }.bind(this);
      this.fetch(vertexShaderPath, onload("vertexShader", vertexShaderType));
      this.fetch(fragmentShaderPath, onload("fragmentShader", fragmentShaderType));
    },
    compile: function (type, shaderStr) {
      var shader = this.gl.createShader(type);
      this.gl.shaderSource(shader, shaderStr);
      this.gl.compileShader(shader);

      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        this.errors.push(this.gl.getShaderInfoLog(shader));
      }

      return shader;
    },
    link: function () {
      var program = this.gl.createProgram();
      this.gl.attachShader(program, this.vertexShader);
      this.gl.attachShader(program, this.fragmentShader);
      this.gl.linkProgram(program);

      if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        this.errors.push(this.gl.getProgramInfoLog(program));
      }

      return program;
    },
    fetch: function (path, cb) {
      var xhr = new XMLHttpRequest;
      xhr.open("GET", path);
      xhr.onload = function () {
        cb(xhr.status === 200, xhr.response);
      };
      xhr.send();
    },
  };

  return WebGLShaderLoader;
})();

