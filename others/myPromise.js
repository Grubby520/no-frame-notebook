//Promise/A+规定的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  // 构造方法接收一个回调
  constructor(executor) {
    this._status = PENDING     // Promise状态
    this._value = undefined// 储存then回调return的值
    this._resolveQueue = []    // 成功队列, resolve时触发
    this._rejectQueue = []     // 失败队列, reject时触发
    /**
     * typeof executor === 'function' 两个入参 resolveFn | rejectFn
     * 由于resolveFn/rejectFn是在executor内部被调用, 因此需要使用箭头函数固定this指向, 否则找不到this._resolveQueue
     * 这2个函数是Promise内部封装实现,当执行函数时，从收集的依赖队列里依次取出回调函数并执行,入参就是异步完成后返回的值
     */
    // val resolve|reject执行时传入的参数
    let _resolve = (val) => {
      //把resolve执行回调的操作封装成一个函数,放进setTimeout里,以兼容executor是同步代码的情况
      // 即使是同步代码，也会放进下一次事件循环队列
      const run = () => {
        if(this._status !== PENDING) return// 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = FULFILLED              // 变更状态
        this._value = val                     // 储存当前value

        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while(this._resolveQueue.length) {
          const callback = this._resolveQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // 实现同resolve
    let _reject = (val) => {
      const run = () => {
        if(this._status !== PENDING) return// 对应规范中的"状态只能由pending到fulfilled或rejected"
        this._status = REJECTED               // 变更状态
        this._value = val                     // 储存当前value
        while(this._rejectQueue.length) {
          const callback = this._rejectQueue.shift()
          callback(val)
        }
      }
      setTimeout(run)
    }
    // new MyPromise()时立即执行executor,并传入resolve和reject
    executor(_resolve, _reject)
  }

  // then方法,接收一个成功的回调和一个失败的回调
  then(resolveFn, rejectFn) {
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    // value 一定是距离上次最近的resolve|reject执行传入的参数(如果连续链式调用的话)
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = error => error : null
  
    // return一个新的promise
    return new MyPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          // 执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value)
          // 分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      // reject同理
      const rejectedFn  = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }
  
      switch (this._status) {
        // 当状态为pending时,把then回调push进resolve/reject执行队列,等待执行
        case PENDING:
          this._resolveQueue.push(fulfilledFn)
          this._rejectQueue.push(rejectedFn)
          break;
        // ??? 疑问 状态变更了，是怎么回事 ???
        // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value)    // this._value是上一个then回调return的值
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }

	// catch 执行then的第二个方法
	catch(rejectFn) {
		return this.then(undefined, rejectFn)
	}

	/**
	 * resolve 返回以给定值的fulfilled态的Promise
	 * ps：返回值的类型区分
	 * 1. 带有\then\方法的thenable对象，返回的promise取决该对象的最终状态
	 * 2. 非thenable对象值，返回这个值的fulfilled态的promise
	 * 3. 这个函数将类promise对象的多层嵌套给予flat
	 */
	static resolve(value) {
		if (value instanceof MyPromise) return value
		return new MyPromise(resolve => resolve(value))
	}

	// reject 返回rejected态的Promise
	static reject(error) {
		return new MyPromise(undefined, reject => reject(error))
	}

	// finally 无论哪种结果都会执行的回调函数 还会把值继续向后传递
	finally(cb) {
		return this.then(
			value => MyPromise.resolve(cb()).then(() => value),
			error => MyPromise.reject(cb()).then(() => { throw error })
		)
	}

	// all 所有promise返回后 | 一个promise reject 才触发modify方法 
	static all(promiseArr) {
		let index = 0
		const result = []
		return new MyPromise((resolve, reject) => {
			promiseArr.forEach((p, i) => {
				// 包装 处理返回值不是promise的场景
				MyPromise.resolve(p).then(val => {
					index++
					result[i] = val
					// 所有接口resolve
					if (index === promiseArr.length) {
						resolve(result)
					}
				}, (error) => {
					// 一个接口reject
					reject(error)
				})
			})
		})
	}

	// race 有一个promise状态改变 立即触发modify 返回promise
	static race(promiseArr) {
		return new MyPromise((resolve, reject) => {
			for (let p of promiseArr) {
				MyPromise.resolve(p)
				.then(value => {
					resolve(value)
				}).catch(error => {
					reject(error)
				})
			}
		})
	}

}
function consol(msg) {
  console.log(msg + ' - ' + new Date().getSeconds())
}

consol('start')

// const p1 = new MyPromise((resolve, reject) => {
//   resolve(1) // 同步executor测试
// })

consol('after new')

// p1
//   .then(res => {
//     consol('first then' + res)
//     return 2 // 链式调用测试
//   })
//   .then()             //值穿透测试
//   .then(res => {
//     consol('third then' + res)
//     return new MyPromise((resolve, reject) => {
//       resolve(3) // 返回Promise测试
//     })
//   })
//   .then(res => {
//     consol('上一个then内部返回Promise的then' + res)
//     throw new Error('reject测试') // reject测试
//   })
//   .then(() => {}, err => {
//     consol('上一个then内部抛出异常' + err)
//   })

new MyPromise((resolve,reject) => {
    console.log('外部promise')
    resolve(new Promise(res => {
      setTimeout(res('settled value was a promise'))
    }))
  })
    .then((res) => {
      console.log(res)
      console.log('外部第一个then')
      // 遇到new会立即执行executor
      return new MyPromise((resolve,reject) => {
        console.log('内部promise')
        // 这tm怎么说
        resolve()
      })
        .then(() => {
        console.log('内部第一个then')
        return MyPromise.resolve()
      })
        .then(() => {
        console.log('内部第二个then')
      })
        // 没有return,Promise会让链式继续下去
    })
      .then(() => {
      console.log('外部第二个then')
    })
      .then(() => {
      console.log('外部第三个then')
    })
      .then(() => {
      console.log('外部第四个then')
    })

consol('end')