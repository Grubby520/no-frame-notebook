/**
 * 实现一个sum函数
 * sum(1,2,3,4).sumOf() // 10
 * sum(1,2)(3)(4).sumOf() // 10
 * sum(1)(2)(3)(4).sumOf() // 10
 */
function sum(...rest) {
  // 定义返回的函数
  const fn = function (...args) {
    // 入参不需要扁平化
    // const mergeArr = rest.concat(args)

    // 入参需要扁平化
    // const mergeArr = rest.concat(args).flat()

    // reduce代替flat
    let mergeArr = rest.concat(args);
    mergeArr = mergeArr.reduce((acc, arr) => acc.concat(arr), []);

    return sum.apply(null, mergeArr);
  };
  // 函数添加属性
  fn.sumOf = function () {
    return rest.reduce((cur, total) => cur + total);
  };
  return fn;
}

/**
 * 1、使用arguments代替rest参数
 */
function sum_01() {
  const rest = Array.prototype.slice.call(arguments);
  // 定义返回的函数
  const fn = function () {
    const args = Array.prototype.slice.call(arguments);
    let mergeArr = rest.concat(args);
    return sum.apply(null, mergeArr);
  };
  // 函数添加属性
  fn.sumOf = function () {
    return rest.reduce((acc, cur) => acc + cur);
  };
  return fn;
}

console.log(sum(1, 2, 3, 4).sumOf()); //10
// console.log(sum(1,2)(3,4).sumOf()) //10
console.log(sum(1, 2)([3, 4]).sumOf()); //10
console.log(sum(1, 2)(3)(4).sumOf()); //10
console.log(sum(1)(2)(3)(4).sumOf()); //10

// console.log(sum_01(1,2,3,4).sumOf()) //10
// console.log(sum_01(1,2)(3,4).sumOf()) //10
// console.log(sum_01(1,2)(3)(4).sumOf()) //10
// console.log(sum_01(1)(2)(3)(4).sumOf()) //10
// test
// positionA - changes
