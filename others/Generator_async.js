/**
 * 异步编程的方式
 * 回调函数
 * 事件监听
 * 观察者之发布/订阅
 * Promise
 * Generator
 */

/**
 * 一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？
 * 原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。
 * 在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段(即为null)
 */

// Thunk函数 单参的只接受回调的函数
var Thunk = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return function (callback) {
      args.push(callback);
      return fn.apply(this, args);
    };
  };
};

// ES6版本
var Thunk = function (fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    };
  };
};

// thunkify函数
function thunkify_1(fn) {
  return function () {
    var args = new Array(arguments.length);
    var ctx = this;

    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }

    return function (done) {
      var called;

      args.push(function () {
        // value值对应一个function，只会执行一次
        if (called) return;
        called = true;
        done.apply(null, arguments);
      });

      try {
        fn.apply(ctx, args);
      } catch (err) {
        done(err);
      }
    };
  };
}

// while遍历，但不符合异步编程(只能是同步的)
function* gen() {
  yield 1;
  yield 2;
  return 3;
}

var g = gen();
var res = g.next();

// while(!res.done){
//   console.log(res.value);
//   res = g.next();
// }

// Generator实现异步操作
// var thunkify = require('thunkify');
// var fs = require('fs');

// var read = thunkify(fs.readFile);

// read('package.json', 'utf8')(function(err, str){
//   console.log(str)
// })

// co函数
// {
//   import co from 'co'
//   co(function* () {
//     var values = [n1, n2, n3];
//     yield values.map(somethingAsync);
//   });

//   function* somethingAsync(x) {
//     // do something async
//     return y
//   }
// }

/**
 * 手动实现async
 * async/await自带执行器，不需要手动调用next()就能自动执行下一步
 * async函数返回值是Promise对象，而Generator返回的是生成器对象
 * await能够返回Promise的resolve/reject的值
 *
 */

const promise = function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("sth wrong"));
    }, 2000);
  });
};

const fns = {
  async getSth() {
    console.log("start");
    const res = await promise().catch((error) => {
      console.log(error);
      return error;
    });

    console.log(res);
    console.log("end");
  },
};

// fns.getSth()

function* MyGenerator() {
  yield Promise.resolve(1);
  yield Promise.resolve(2);
  yield Promise.resolve(3);
}

const gen1 = MyGenerator();

// gen1.next().value.then(res => {
//   console.log(res)
//   gen1.next().value.then(res => {
//     console.log(res)
//     gen1.next().value.then(res => {
//       console.log(res)
//     })
//   })
// })

// 不手动调用next()
function autoNext(gen) {
  if (gen.constructor.name !== "GeneratorFunction") return;
  gen = gen();
  function next(val) {
    const obj = gen.next(val);
    if (obj.value instanceof Promise && !obj.done) {
      obj.value.then((res) => {
        console.log(res);
        next(res);
      });
    } else {
      return obj.value;
    }
  }

  next();
}

// const result = autoNext(MyGenerator)
// console.log(result) // undefined

// 把基本类型包装成promise
// 异常处理,新增throw
// 返回值是promise
function run(gen) {
  return new Promise((resolve, reject) => {
    const g = gen();
    function step(val) {
      let result = {};
      try {
        result = g.next(val);
      } catch (error) {
        reject(error); // 异常处理
        return;
      }
      if (result.done) {
        resolve(result.value);
        return;
      }
      // 包装
      Promise.resolve(result.value)
        .then((res) => {
          step(res); // 递归，自动next
        })
        .catch((error) => {
          g.throw(error); // 外部catch内部的错误
        });
    }
    step();
  });
}

function* myGenerator() {
  try {
    console.log(yield Promise.resolve(1));
    console.log(yield 2); // 2
    console.log(yield Promise.reject("throw inner error"));
  } catch (error) {
    console.log(error);
  }
}

const cb = run(myGenerator);
console.log(cb);

// babel对async的转换
function _asyncToGenerator(fn) {
  return function () {
    var self = this;
    var args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      //相当于我们的step()
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      //处理异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

// to es2015
function* foo() {
  yield "result1";
  yield "result1";
}

("use strict");

var _marked = [foo].map(regeneratorRuntime.mark);

function foo() {
  return regeneratorRuntime.wrap(
    function foo$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return "result1";

          case 2:
            _context.next = 4;
            return "result1";

          case 4:
          case "end":
            return _context.stop();
        }
      }
    },
    _marked[0],
    this
  );
}

/**
 * regeneratorRuntime 模块
 * .mark方法
 * .wrap方法
 */
{
  // 源码抽象出来
  runtime.mark = function (genFun) {
    // 原型上添加一系列方法
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  function wrap(innerFn, outerFn, self) {
    var generator = Object.create(outerFn.prototype); // outerFn.prototype === genFun.prototype
    var context = new Context([]); // 全局对象，储存上下文和内部的各种状态
    generator._invoke = makeInvokeMethod(innerFn, self, context); // 给Generator增加一个_invoke方法
    // ...
    return generator;
  }

  var ContinueSentinel = {};

  var context = {
    done: false,
    method: "next",
    next: 0,
    prev: 0,
    abrupt: function (type, arg) {
      var record = {};
      record.type = type;
      record.arg = arg;

      return this.complete(record);
    },
    complete: function (record, afterLoc) {
      if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      }

      return ContinueSentinel;
    },
    stop: function () {
      this.done = true;
      return this.rval;
    },
  };
}

// makeInvokeMethod的invoke方法，用于判断当前状态和执行下一步，实际就是调用next()
function makeInvokeMethod(innerFn, context) {
  // 将状态置为start
  var state = "start";

  return function invoke(method, arg) {
    // 已完成
    if (state === "completed") {
      return { value: undefined, done: true };
    }
    context.method = method;
    context.arg = arg;

    // 执行中
    while (true) {
      state = "executing";

      var record = {
        type: "normal",
        arg: innerFn.call(self, context), // 执行下一步,并获取状态(其实就是switch里边return的值)
      };

      if (record.type === "normal") {
        // 判断是否已经执行完成
        state = context.done ? "completed" : "yield";

        // ContinueSentinel其实是一个空对象,record.arg === {}则跳过return进入下一个循环
        // 什么时候record.arg会为空对象呢, 答案是没有后续yield语句或已经return的时候,也就是switch返回了空值的情况(跟着上面的switch走一下就知道了)
        if (record.arg === ContinueSentinel) {
          continue;
        }
        // next()的返回值
        return {
          value: record.arg,
          done: context.done,
        };
      }
    }
  };
}

// 为什么generator._invoke实际上就是gen.next呢，因为在runtime对于next()的定义中，next()其实就return了_invoke方法
// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype) {
  ["next", "throw", "return"].forEach(function (method) {
    prototype[method] = function (arg) {
      return this._invoke(method, arg);
    };
  });
}

/**
 * 抛开源码中纠集的很多概念和封装，实现一个低配版，并做调用流程分析
 * 
	1. 我们定义的function*生成器函数被转化为以上代码
	2. 转化后的代码分为三大块：
      gen$(_context)由yield分割生成器函数代码而来
      context对象用于储存函数执行上下文
      invoke()方法定义next()，用于执行gen$(_context)来跳到下一步
	3. 当我们调用g.next()，就相当于调用invoke()方法，执行gen$(_context)，进入switch语句，switch根据context的标识，执行对应的case块，return对应结果
	4. 当生成器函数运行到末尾（没有下一个yield或已经return），switch匹配不到对应代码块，就会return空值，这时g.next()返回{value: undefined, done: true}
 */

// 生成器函数根据yield语句将代码分割为switch-case块，后续通过切换_context.prev和_context.next来分别执行各个case
function gen$(_context) {
  while (1) {
    switch ((_context.prev = _context.next)) {
      case 0:
        _context.next = 2;
        return "result1";

      case 2:
        _context.next = 4;
        return "result2";

      case 4:
        _context.next = 6;
        return "result3";

      case 6:
      case "end":
        return _context.stop();
    }
  }
}

// 低配版context
var context = {
  next: 0,
  prev: 0,
  done: false,
  stop: function stop() {
    this.done = true;
  },
};

// 低配版invoke
let gen = function () {
  return {
    next: function () {
      value = context.done ? undefined : gen$(context);
      done = context.done;
      return {
        value,
        done,
      };
    },
  };
};

// 测试使用
var g = gen();
g.next(); // {value: "result1", done: false}
g.next(); // {value: "result2", done: false}
g.next(); // {value: "result3", done: false}
g.next(); // {value: undefined, done: true}

/**
 * 总结
 * Generator实现的核心在于上下文的保存，函数并没有真的被挂起，
 * 每一次yield，其实都执行了一遍传入的生成器函数，
 * 只是在这个过程中间用了一个context对象储存上下文，使得每次执行生成器函数的时候，
 * 都可以从上一个执行结果开始执行，看起来就像函数被挂起了一样
 *
 * 瞻仰大佬
 * 前端技匠、神三元、winty、冴羽
 */
