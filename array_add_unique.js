function array_add_unique(arr, ...adds) {
    adds.forEach(add => arr.includes(add) || arr.push(add));
    return arr;
}

if (!Array.prototype.addUnique) {
  Array.prototype.addUnique = function(...add) {
      return array_add_unique(this, ...add);
  };
}
