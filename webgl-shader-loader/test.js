var gl = document.createElement("canvas").getContext("webgl");

var vertexShaderStr =
  "void main () { gl_Position = vec4(0.0, 0.0, 0.0, 1.0); }";

var fragmentShaderStr =
  "precision mediump float; void main () { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }";

var loader = new WebGLShaderLoader(gl);

loader.loadFromStr(vertexShaderStr, fragmentShaderStr, function (errors, program) {
  if (errors.length > 0) {
    console.error.apply(console, errors);
    return;
  }

  console.log(program);
});

var vertexShaderPath = "vertex.glsl";
var fragmentShaderPath = "fragment.glsl";

loader.loadFromXHR(vertexShaderPath, fragmentShaderPath, function (errors, program) {
  if (errors.length > 0) {
    console.error.apply(console, errors);
    return;
  }

  console.log(program);
});

