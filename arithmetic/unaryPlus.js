/**
 * 首次完成时间: 2h
 * 给你一个包含 n 个整数的数组，判断该数组中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组
 */

/**
 * 思路：
 * 倒序计算，数组下标判断逻辑更简单
 * 从尾到头依次取值进行判断
 * 复杂度：(O(n2))
 * (n-2)+(n-3)+...+2+1 + (n-3)+(n-4)+...+2+1+...+3+2+1+2+1+1
 * (n-1)*(n-2)/2+...
 */
let timer = 0
function unaryPlus(arr) {
    const result = []
    if (arr.length) {
        let maxI = arr.length - 1
        while (maxI > -1) {
            const startVal = arr[maxI]
            let middleI = --maxI
            while (middleI > -1) {
                const middleVal = arr[middleI]
                let endI = --middleI
                while (endI > -1) {
                    timer++
                    const endVal = arr[endI]
                    startVal + middleVal + endVal === 0
                        ? result.push([startVal, middleVal, endVal])
                        : null
                    endI--
                }
            }
        }
    }
    return result
}

let timer2 = 0
function unaryPlusBetter(arr) {
    const result = []
    arr = arr.sort((a, b) => a - b) // 排序
    let minusArr = [], positiveArr = [], zeroLen = 0
    const zero = 0
    const zeroExist = arr.indexOf(zero) !== -1 ? true : false
    // 负数和正数分类
    if (zeroExist) {
        const zeroIndexFirst = arr.findIndex(val => val === zero)
        minusArr = arr.slice(0, zeroIndexFirst)
        const zeroIndexLast = arr.lastIndexOf(zero)
        positiveArr = arr.slice(zeroIndexLast + 1)
        zeroLen = zeroIndexLast - zeroIndexFirst + 1
    } else {
        const middleIndex = arr.findIndex(val => val > zero)
        minusArr = arr.slice(0, middleIndex)
        positiveArr = arr.slice(middleIndex)
    }
    minusArr = minusArr.reverse()
    // console.log(minusArr, positiveArr, zeroLen)
    // 根据负数当前的值，缩小范围进行匹配
    minusArr.forEach(val => {
        const _val = Math.abs(val)
        const {equalLen, restArr} = compareExistValAndLen(_val, positiveArr)
        // 包含重复项
        if (equalLen && zeroLen) {
            const repeatTimes = equalLen * zeroLen
            const startIndex = result.length
            result.length =+ startIndex + repeatTimes
            result.fill([val, zero, _val], startIndex)
        }
        // 取值判断
        let middleI = restArr.length - 1
        let seeEndI = -1
        while (middleI > -1) {
            const middleVal = restArr[middleI]
            const minEndI = seeEndI
            let endI = --middleI
            while (endI > minEndI) {
                timer2++
                const endVal = restArr[endI]
                if (val + middleVal + endVal === 0) {
                    result.push([val, middleVal, endVal])
                    // 根据当前匹配成功的最小值下标来缩小范围，作为下一次while的循环结束条件
                    seeEndI = endI - 1 // 踩坑点1
                }
                endI--
            }
        }
    })
    positiveArr.forEach(val => {
        const _val = Math.abs(val) * -1
        const {equalLen, restArr} = compareExistValAndLen(_val, minusArr)
        // 取值判断
        let middleI = restArr.length - 1
        let seeEndI = -1
        while (middleI > -1) {
            const middleVal = restArr[middleI]
            let endI = --middleI
            const minEndI = seeEndI
            while (endI > minEndI) {
                timer2++
                const endVal = restArr[endI]
                if (val + middleVal + endVal === 0) {
                    result.push([val, middleVal, endVal])
                    // 根据当前匹配成功的最小值下标来缩小范围，作为下一次while的循环结束条件
                    seeEndI = endI -1
                }
                endI--
            }
        }
    })
    
    // 找到相同元素的范围区间
    function compareExistValAndLen(val, arr) {
        let [equalLen, restArr] = [0, []]
        const index = arr.indexOf(val)
        if (index < 0) {
            equalLen = 0
            let lastIndex = arr.findIndex(item => item < val)
            // lastIndex = lastIndex < 0 ? 0 : lastIndex + 1
            restArr = arr.slice(0, lastIndex)
        } else {
            const lastIndex = arr.lastIndexOf(val)
            equalLen = lastIndex - index + 1
            restArr = arr.slice(0, index)
        }
        return {
            equalLen: equalLen,
            restArr: restArr
        }
    }

    return result
}

function getRunTime(arr, fn) {
    const start = new Date().valueOf()
    const result = fn(arr)
    const end = new Date().valueOf()
    const time = (end - start)
    console.log('用时：' + time)
    return result
}

function randomArr(maxVal, len) {
    const result = []
    while(len > -1) {
        const unit = Math.random() > 0.5 ? 1 : -1
        const temp = Math.floor(Math.random() * maxVal) * unit
        result.push(temp)
        len--
    }
    return result
}

const arr = randomArr(10, 15)
console.log(arr)

console.log(getRunTime(arr, unaryPlus))
// console.log('循环次数：' + timer)

console.log(getRunTime(arr, unaryPlusBetter))
// console.log('循环次数：' + timer2)
