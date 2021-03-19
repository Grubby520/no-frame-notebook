const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

import { isFunction, getDataType, isArray } from './util'

class MyPromise {
    constructor(executor) {
        if (!isFunction(executor)) {
            let dataType = ''
            if (typeof executor === 'object' && executor !== null) {
                dataType = getDataType(executor)
            } else {
                dataType = executor
            }
            throw new TypeError(`Promise resolver ${dataType} is not a function`) // copy Console的测试结果
        } else {
            this._result = undefined
            this._status = PENDING
            this._resolveQueue = []
            this._rejectQueue = []

            const notifyResolveQueue = () => {
                while (this._resolveQueue.length > 0) {
                    const cb = this._resolveQueue.shift()
                    cb(this._result)
                }
            }

            const notifyRejectQueue = () => {
                while (this._rejectQueue.length > 0) {
                    const cb = this._rejectQueue.shift()
                    cb(this._result)
                }
            }

            const resolve = (val) => {
                // 即使已经settled，也不会立即执行，会放到微任务队列里（与setTimeout极为相似）
                // 故用函数再包装一层
                const setMicroTask = () => {
                    if (this._status !== PENDING) return // 单向改变，不可逆，不再改变
                    // 返回值本身是一个promise,父promise的状态取决于子promise的状态
                    if (val instanceof MyPromise) {
                        val.then((result) => {
                            this._result = result
                            this._status = FULFILLED
                            notifyResolveQueue()
                        }).catch((err) => {
                            this._result = err
                            this._status = REJECTED
                            notifyRejectQueue()
                        })
                    } else {
                        // 保持链式继续
                        this._result = val
                        this._status = FULFILLED
                        notifyResolveQueue()
                    }
                }
                setTimeout(setMicroTask)
            }

            const reject = (val) => {
                const setMicroTask = () => {
                    if (this._status !== PENDING) return
                    this._result = val
                    this._status = REJECTED
                    notifyRejectQueue()
                }
                setTimeout(setMicroTask)
            }

            try {
                executor(resolve, reject)
            } catch (error) {
                return reject(error)
            }
        }
    }

    then(resolveFn, rejectFn) {
        // 链式调用,返回新的promise
        return new MyPromise((resolve, reject) => {
            // 根据返回的值的类型做分类处理,故用函数包装一层
            const _fulfilledFn = () => {
                try {
                    if (isFunction(resolveFn)) {
                        const response = resolveFn(this._result)
                        response instanceof MyPromise ? response.then(resolve, reject) : resolve(response)
                    } else {
                        resolve(this._result)
                    }
                } catch (error) {
                    reject(error)
                }
            }

            const _rejectedFn = () => {
                try {
                    if (isFunction(rejectFn)) {
                        const response = rejectFn(this._result)
                        response instanceof MyPromise ? response.then(resolve, reject) : resolve(response) // catch返回的promise,同样与then一样,取决于本身返回值
                    } else {
                        reject(this._result)
                    }
                } catch (error) {
                    reject(error)
                }
            }

            // 根据状态做不同的处理
            // (宏任务与微任务有一定的区别,在错误使用,多个流并行执行时,返回时机不可预期)
            switch (this._status) {
                case PENDING:
                    this._resolveQueue.push(_fulfilledFn)
                    this._rejectQueue.push(_rejectedFn)
                    break
                case FULFILLED:
                    _fulfilledFn()
                    break
                case REJECTED:
                    _rejectedFn()
                    break
                default:
                    throw new TypeError(`Promise status ${this._status} is wrong`)
                    break
            }
        })
    }

    catch(rejectFn) {
        return this.then(null, rejectFn)
    }

    finally(cb) {
        return this.then(cb, cb)
        // another way
        // {
        //     return this.then(
        //         result => MyPromise.resolve(cb()).then(() => result),
        //         error => MyPromise.reject(cb()).then(() => { throw error })
        //     )
        // }
    }

    // 静态方法 只能通过类调用,实例不能继承
    static resolve(result) {
        if (result instanceof MyPromise) {
            return result // 返回类型是promise,取决于本身
        }
        return new MyPromise(resolve => resolve(result)) // 值类型非promise,一定返回fulfilled态
    }

    static reject(result) {
        return new MyPromise((undefined, reject) => reject(result))
    }

    static all(iterable) {
        if (isArray(iterable)) {
            return new MyPromise((resolve, reject) => {
                const len = iterable.length
                let [count, result] = [0, []]
                for(let i = 0; i < len; i++) {
                    iterable[i]
                        .then((res) => {
                            count++
                            result.push(res)
                            if (count === len) {
                                resolve(result) // 全部fulfilled，才resolve
                            }
                        }).catch((error) => {
                            reject(error) // 一旦出现rejected，立即reject
                        })
                }
            })
        } else {
            const dataType = typeof iterable
            return MyPromise.reject(() => {
                throw new TypeError(`${dataType} is not iterable`)
            })
        }
    }

    static race(iterable) {
        return new MyPromise((resolve, reject) => {
            const len = iterable.length
            for (let i = 0; i < len; i++) {
                iterable[i]
                    .then(res => {
                        resolve(res)
                    }).catch(error => {
                        reject(error)
                    })
            }
        })
    }

}

console.log(MyPromise.reject(1))

new MyPromise((resolve, reject) => {
    console.log('外部promise')
    resolve(new Promise(res => {
      setTimeout(res('settled value was a promise'))
    }))
  })
    .then((res) => {
      console.log(res)
      console.log('外部第一个then')
      return new MyPromise((resolve,reject) => {
        console.log('内部promise')
        // 这tm怎么说
        resolve('inner promise')
      })
        .then(() => {
        console.log('内部第一个then')
        return MyPromise.resolve()
      })
        .then(() => {
        console.log('内部第二个then')
      })
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

MyPromise.all({})