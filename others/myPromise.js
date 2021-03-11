const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
	constructor(executor) {
		// console.log(1)
		// console.log(executor)
		this._status = PENDING
		this._resolveQueue = []
		this._rejectQueue = []

		const _resolve = (val) => {
			if (this._status !== PENDING) return
			this._status = FULFILLED
			while(this._resolveQueue.length) {
				const cb = this._resolveQueue.shift()
				cb(val)
			}
		}

		const _reject = (val) => {
			if (this._status !== PENDING) return
			this._status = REJECTED
			while(this._rejectQueue.length) {
				const cb = this._rejectQueue.shift()
				cb(val)
			}
		}

		// new操作时立即执行入参函数
		executor(_resolve, _reject)
	}

    // 收集依赖
	then(resolveFn, rejectFn) {
		// console.log(3)
		// console.log(resolveFn)
		// 满足链式调用，返回一个promise
		return new MyPromise((resolve, reject) => {
			const fulfilledFn = value => {
				try {
					const x = resolveFn(value)
					x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
				} catch (error) {
					reject(error)
				}
			}
			this._resolveQueue.push(fulfilledFn)

			const rejectedFn = value => {
				try {
					const x = rejectFn(value)
					x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
				} catch (error) {
					reject(error)
				}
			}
			this._rejectQueue.push(rejectedFn)
		})
		// this._resolveQueue.push(resolve)
		// this._rejectQueue.push(reject)
	}
}

{
    const myPromise = new MyPromise((resolve) => {
        // console.log(2)
        // console.log(resolve)
        setTimeout(() => {
            // console.log(4)
            // console.log(resolve)
            resolve('success')
        }, 1500)
    })

		console.log(myPromise)

		// Subscriber
    // myPromise.then(res => {
    //     console.log(5)
    //     console.log(res)
    // })

    // Subscriber
    // myPromise.then(res => {
    //     console.log(5.1)
    //     console.log(res)
    // })

		// chaining
		const chainingP = myPromise
			.then(res => {
				console.log(res)
				return {
					res
				}
			}).then(res1 => {
				console.log(res1)
			})

		console.log(chainingP)
}

// {
// 	/**
// 	 * 链式调用，返回的值必然是一个新的promise
// 	 * 链式顺序执行，上一个promise状态改变才会触发依赖执行
// 	 * 
// 	 */
// 	const p1 = new Promise((resolve, reject) => {
// 			resolve(1)
// 	})
	
// 	const result = 
// 		p1
// 			.then(res => {
// 					console.log(res)
// 					return {
// 							success: true,
// 							data: []
// 					}
// 			})
// 			.then(res => {
// 				console.log(res)
// 				return new Promise(resolve => {
// 					setTimeout(() => {
// 						resolve('new Promise result')
// 					}, 1000)
// 				})
// 			})
// 			.then(res => {
// 				console.log(res)
// 			})
// 	console.log(result)
// }
