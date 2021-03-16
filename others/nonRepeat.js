const list = [
    {
        id: 1,
        name: '1'
    }, {
        id: 2,
        name: '2'
    }, {
        id: 1,
        name: '3'
    }
]

function repeatFilter(data = [], compareKey = 'id') {
    if (!Array.isArray(data)) {
        return data
    }
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

function repeatFilter_1(data) {
    return Array.from(new Set(data))
}

const result = repeatFilter(list, 'id')
console.log(result)

console.log(repeatFilter_1([1,2,3,2]))
const o = {a : 1}
let arr = [null, undefined, null, undefined, false, true, false, true]
arr.push(o)
arr.push(o)
arr.push(1)
arr.push(1)
arr.push(2)
console.log(arr)
console.log(repeatFilter_1(arr)) // [null, undefined, false, true, {…}, 1, 2]

const o_1 = {a: 1}
arr.push(o_1)
console.log(arr)
console.log(repeatFilter_1(arr)) 