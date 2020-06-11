//[object Array|Object|Date]

function get_object_tostring_type(param) {
  let objtype = Object.prototype.toString.call(param);
  return objtype.replace(/^\[object (.+)\]/, '$1');
}
