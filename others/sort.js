const colors = ['r', 'g', 'b']
const sizes = ['s', 'm', 'l', 'xl']

function combine() {
    const cIndex = Math.floor(colors.length * Math.random())
    const sIndex = Math.floor(sizes.length * Math.random())
    return {
        color: colors[cIndex],
        size: sizes[sIndex]
    }
}

function getOriginList(len = 10) {
    const result = []
    for(let i = 0; i < len; i++) {
        const obj = combine()
        result.push({
            ...obj,
            id: i
        })
    }
    return result
}

/**
 * 实现组合排序
 */
function combineSort(list = []) {
    const result = []
    // 具体实现
    list.sort()
    return result
}

const originList = getOriginList(20)

console.log(originList)

const combineList = combineSort(originList)

console.log(combineList)