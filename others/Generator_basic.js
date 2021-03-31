

/**
 * async/await实际上是对Generator（生成器）的封装
 * Generator 函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行
 * 调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。
 * 以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象
 */
function* helloWorldGenerator() {
    console.log('start')
  yield 'hello';
  console.log('next')
  yield 'world';
  return 'ending';
}

const hw = helloWorldGenerator() // 函数并没有立即执行
console.log(hw)
console.log(hw.next()) // next()执行，停留在第一个yield指针位置
console.log(hw.next()) // 停留在第二个yield指针位置
console.log(hw.next()) // 终止

function* f() {
  console.log('执行了！')
}

var generator = f();
console.log('还没执行？')
generator.next()

/**
 * Iterator接口
 * 可迭代的数据，Array,Map,String的原型上都有一个Symbol.iterator方法
 */
function isIterable(iterable) {
    return typeof iterable[Symbol.iterator] === 'function'
}

var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

const restData = [...myIterable] // [1, 2, 3]
console.log(restData)

console.log(hw[Symbol.iterator]() === hw) // true

const str = 'String'
for (key in str) {
    console.log(key)
}
for (value of str) {
    console.log(value)
}

// 从暂停状态到恢复运行，它的上下文状态（context）是不变的, 可以外部注入上一次yield的值（next方法的参数表示上一个yield表达式的返回值）
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
console.log(a.next()) // Object{value:6, done:false}
console.log(a.next()) // Object{value:NaN, done:false}
console.log(a.next()) // Object{value:NaN, done:true}

var b = foo(5);
console.log(b.next()) // { value:6, done:false }
console.log(b.next(12)) // { value:8, done:false }
console.log(b.next(13)) // { value:42, done:true }

// for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法
// 斐波那契数列
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}

// 扩展运算符（...）、解构赋值和Array.from方法内部调用的Iterator
function* numbers() {
    yield 1
    yield 2
    return 3 // return 即为终止，不会作为iterator数组的值
    yield 4
}
const collection = numbers()
console.log([...collection])
console.log(Array.from(numbers()))
let [x, y] = numbers()
console.log(x, y)
for (let value of numbers()) {
    console.log(value)
}

// Generator.prototype.throw
// （1）外部catch内部的错误
function* foo1() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo1();

it.next(); // { value:3, done:false }

try {
  it.next(42);
} catch (err) {
  console.log(err);
}

// （2）内部catch外部的错误
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));

// Generator.prototype.return
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

console.log(g.next())        // { value: 1, done: false }
console.log(g.return()) // { value: undefined, done: true }

// yield* 表达式 ---------------------------------------------------
function* foo2() {
  yield 'a';
  yield 'b';
}

function* bar2() {
    yield 'x'
    yield* foo2()
    yield 'y'
}

for (let v of bar2()){
  console.log(v);
}

function* concat_1(iter1, iter2) {
  yield* iter1; // 加了*，表示返回的是数组的遍历器对象
  yield* iter2;
}

// 等同于

function* concat_2(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}

function* genFuncWithReturn() {
  yield 'a';
  yield 'b';
  return 'The result';
}
function* logReturned(genObj) {
  let result = yield* genObj;
  console.log(result);
}

[...logReturned(genFuncWithReturn())]
// The result
// 值为 [ 'a', 'b' ]

// flat flatMap的实现
function* iterTree(tree) {
  if (Array.isArray(tree)) {
    for(let i=0; i < tree.length; i++) {
      yield* iterTree(tree[i]);
    }
  } else {
    yield tree;
  }
}

const tree = [ 'a', ['b', 'c'], ['d', 'e'] ];

for(let x of iterTree(tree)) {
  console.log(x);
}

const flatArr = [...iterTree(tree)]
console.log(flatArr)

// Generator也是函数，关于函数，额外的补充 ---------------
// （1）this Generator返回一个遍历器(不能当构造函数使用)，它是继承Generator函数的实例，继承了prototype上的方法
function* g1() {}

g1.prototype.hello = function () {
  return 'hi!';
};

let obj = g1();

obj instanceof g1 // true
obj.hello() // 'hi!'

// 变相处理没有this指向的问题
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj_1 = {};
var f1 = F.call(obj_1);

f1.next();  // Object {value: 2, done: false}
f1.next();  // Object {value: 3, done: false}
f1.next();  // Object {value: undefined, done: true}

obj_1.a // 1
obj_1.b // 2
obj_1.c // 3

// 让遍历器对象f 和 生成的对象实例obj 统一成一个
function* F1() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var f2 = F1.call(F1.prototype); // 遍历器对象内部this指向她的prototype
// var f = F.call(obj);

f2.next();  // Object {value: 2, done: false}
f2.next();  // Object {value: 3, done: false}
f2.next();  // Object {value: undefined, done: true}

f2.a // 1
f2.b // 2
f2.c // 3

// （2）Generator 与 协程
// （3）Generator 与 Context
// JavaScript 代码运行时，会产生一个全局的上下文环境（context，又称运行环境），包含了当前所有的变量和对象。
// 然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈（context stack）
// ‘后进先出’的数据结构，最后产生的上下文最先执行完毕，退出堆栈，再执行完成它下层的上下文，直到所有代码执行完成，堆栈清空。

/**
 * Generator 函数不是这样，它执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，
 * 里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行
 */
function* gen2() {
  yield 1;
  return 2;
}

let g2 = gen2();

console.log(
  g2.next().value,
  g2.next().value,
);
// 第一次执行g.next()时，Generator 函数gen的上下文会加入堆栈，即开始运行gen内部的代码
// 遇到yield 1时，gen上下文退出堆栈，内部状态冻结
// 第二次执行g.next()时，gen上下文重新加入堆栈，变成当前的上下文(通过next(params)传入，作为上一次yield的值)，重新恢复执行


// 应用 application ---------------------------------------------
/**
 * 异步操作同步化
 * 控制流管理（地狱回调 -> Promise链式调用 -> 同步方式编写）
 * 部署Iterator接口
 * 作为数据结构
 */
