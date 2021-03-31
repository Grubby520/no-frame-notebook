/**
 * 异步编程的方式
 * 回调函数
 * 事件监听
 * 观察者之发布/订阅
 * Promise
 * Generator (async)
 */

/**
 * 一个有趣的问题是，为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？
 * 原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。
 * 在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段(即为null)
 */

/**
 * async函数
 * 内置执行器 (co)
 * 语义化和实用性
 * 返回Promise
 * async函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而await命令就是内部then命令的语法糖
 * 
 * 状态变化：
 * 所以await执行完毕才会then，一个await失败即中断然后catch
 * 不能用于普通函数中，如forEach，应该使用for循环
 */

function genApi(fulfilled = true, sec = 800) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const res = {
        success: true
      }
      fulfilled ? resolve(res) : reject(res)
    })
  }, sec)
}

// 优雅的处理async异常
function awaitTo(promise) {
  if (promise instanceof Promise) {
    return promise.then(res => {
      return [null, res]
    }).catch(err => {
      return [err]
    })
  } else {
    return Promise.resolve(promise)
  }
}

const fn = {
  async combineApi() {
    // try-catch捕获异常
    // try {
    const res1 = await awaitTo(genApi(false))
    // 另一种写法
    // const res1 = await awaitTo(genApi(false)).catch((err) => {return [err]})
    console.log(res1)
    const res2 = await awaitTo(genApi(true))
    return [res1, res2]
    // } catch (err) {
    //   console.log(err)
    //   return err
    // }
  }
}

const result = fn.combineApi()
result.then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
