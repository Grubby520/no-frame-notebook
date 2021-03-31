/**
 * 金额格式化：每千分位使用逗号分隔
 * @param {number} num 金额
 * @returns 每千位按逗号分隔
 */
export function moneyFormatter(num) {
    num = +num
    if (!isNaN(num)) {
        let [int, dec] = num.toString().split('.')
        const reg = /(-?\d+)(\d{3})/g
        while (reg.test(int)) {
            int = int.replace(reg, '$1,$2')
        }
        return dec ? [int, dec].join('.') : int
    } else {
        return '-'
    }
}

/**
 * 对象数组去重
 * @param {Object[]} data 数据源
 * @param {String} compareKey 对比的property
 */
export function filterRepeat(data, compareKey) {
    const mapper = {}
    return data.reduce((acc, item) => {
        const key = item[compareKey]
        if (!mapper[key]) {
            mapper[key] = true
            acc.push(item)
        }
        return acc
    }, [])
}

/**
 * 优雅处理await异步promise的异常
 * @param {Promise} promise 
 * @returns {Promise} promise实例
 */
export function awaitTo(promise) {
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