importScripts('webgl-shader-loader/webGLShaderLoader.js');
importScripts('webgl-shader-loader/webGLUtils.js');
importScripts('gl-matrix/dist/gl-matrix.js');

var render = null;

function createContext (canvas) {
  var loader = new WebGLShaderLoader(canvas);
  loader.loadFromXHR('mvp.vert', 'points.frag', function (errors, program, gl) {
    if (errors.length > 1) return console.error.apply(console, errors);

    gl.useProgram(program);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var attributes = getAttributes(gl, program);
    var uniforms = getUniforms(gl, program);
    var n = initBuffers(gl, attributes);

    // world space -> camera space
    var eye = vec3.fromValues(0, 0, 3);
    var lookAt = vec3.fromValues(0, 0, 0);
    var up = vec3.fromValues(0, 1, 0);
    var viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, eye, lookAt, up);
    gl.uniformMatrix4fv(uniforms.uViewMatrix, false, viewMatrix);

    // camera space -> screen
    var projMatrix = mat4.create();
    mat4.perspective(projMatrix, 30 * Math.PI / 180,
      canvas.width / canvas.height, 1, 10);
    gl.uniformMatrix4fv(uniforms.uProjMatrix, false, projMatrix);

    render = createAnimate(gl, uniforms.uModelMatrix, n);
  });
};

onmessage = function (e) {
  if (e.data.rAF && render) {
    render();
  } else if (e.data.canvas) {
    createContext(e.data.canvas);
  }
};

// code that used to be on the main thread
function initBuffers (gl, attributes) {
  var positions = new Float32Array([
    0.0,  0.5,  0.0,
    -0.5, -0.5,  0.0,
    0.5, -0.5,  0.0,
  ]);
  var colors = new Float32Array([
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    1.0, 0.0, 1.0,
  ]);

  initBuffer(gl, positions, 3, attributes.aPosition);
  initBuffer(gl, colors, 3, attributes.aColor);

  return 3;
};

function createAnimate (gl, modelUniform, n) {
  var modelMatrix = mat4.create();
  return function () {
    // update
    mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 180);
    gl.uniformMatrix4fv(modelUniform, false, modelMatrix);
    // render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);

    gl.commit(); // new for webgl in workers
  };
};
