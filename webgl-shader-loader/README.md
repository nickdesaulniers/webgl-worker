webgl-shader-loader
===================

Asynchronous load, compile, and link webgl shader programs

```html
<script src="webGLShaderLoader.js"></script>
```

##Load WebGL Program From Shader String Literals
```javascript
var loader = new WebGLShaderLoader(gl);
loader.loadFromStr(vertexShaderStr, fragmentShaderStr, function (errors, program) {
  if (errors.length > 0) {
    console.error.apply(console, errors);
    return;
  }

  console.log(program);
});
```

##Load WebGL Program From XHR'd Files
```javascript
var loader = new WebGLShaderLoader(gl);
loader.loadFromXHR(vertexShaderPath, fragmentShaderPath, function (errors, program) {
  if (errors.length > 0) {
    console.error.apply(console, errors);
    return;
  }

  console.log(program);
});
```

###Notes
* Look at test.js for further usage/example
* errors is an array of strings of usage, compilation, and linkage errors, it's up to you to check these.

###License
"THE BEER-WARE LICENSE" (Revision 42):
<nick@mozilla.com> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.  Nick Desaulniers

