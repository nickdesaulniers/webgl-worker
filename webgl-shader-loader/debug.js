function debugTriangle (a, b, c) {
  var str = "(";
  for (var i = 0; i < arguments.length; ++i) {
    str += "(";
    for (var j = 0; j < arguments[i].length; ++j) {
      str += arguments[i][j];
      if (j !== arguments[i].length - 1) {
        str += ", ";
      }
    }
    str += ")";
  }
  str += ")";
  console.log(str);
};

