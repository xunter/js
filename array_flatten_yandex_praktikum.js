function flatten(list) {
    // code here
  let arrs = [list];
  while (arrs.length) {
    let arr = arrs.pop();
    
    if (Object.prototype.toString.call(arr).includes('Array')) {
      while (arr.length) {
        let inner = arr.pop();
        arrs.push(inner);
      }
    } else {
      list.push(arr);
    }
  }
  
  return list;
}

console.log([1, 'any [complex] string', null, function() {}, [1, 2, [3, '4'], 0], [], { a: 1 }]);
console.log(flatten([1, 'any [complex] string', null, function() {}, [1, 2, [3, '4'], 0], [], { a: 1 }]));
