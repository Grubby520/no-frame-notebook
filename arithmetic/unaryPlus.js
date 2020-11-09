/**
 * 首次完成时间: 2h
 * 给你一个包含 n 个整数的数组，判断该数组中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有满足条件且不重复的三元组
 */

const arr = [0, 1, 2, 3, 4, -5, 6, -7]
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
                    debugger
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
console.log(getRunTime(arr, unaryPlus))
console.log(timer)

function getRunTime(arr, fn) {
    const start = new Date().valueOf()
    fn(arr)
    const end = new Date().valueOf()
    const time = (end - start)
    console.log(time)
}
