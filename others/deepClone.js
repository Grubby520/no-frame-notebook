function isArray(data) {
    return Array.isArray(data)
}

function isNotObject(data) {
    return typeof data !== 'object' || data === null
}

function deepClone(data) {
    if (isNotObject(data)) {
        return data
    }
    const result = isArray(data) ? [] : {}
    recursiveFn(data, result)
    return result

    function recursiveFn(data, result) {
        // 数组
        if (isArray(data)) {
            data.forEach((item, index) => {
                if (isNotObject(item)) {
                    result[index] = item
                } else {
                    result[index] = isArray(item) ? [] : {}
                    recursiveFn(item, result[index])
                }
            })
        } else {
            // 对象
            for (key in data) {
                const value = data[key]
                if (isNotObject(data[key])) {
                    result[key] = value
                } else {
                    result[key] = isArray(value) ? [] : {}
                    recursiveFn(value, result[key])
                }
            }
        }
    }
}

// const arr = [1, 2, {a: 1}, [1, 2, {a: 2}]]
// const result = deepClone(arr)
// arr[0] = 11
// arr[1] = 22
// arr[2].a = 11
// arr[3][0] = 11
// arr[3][1] = 22
// arr[3][2].a = 22
// console.log(arr)
// console.log(result)


// const obj = {
//     a: 1,
//     b: [1, 2],
//     c: {
//         a: [1],
//         b: {
//             a: 1
//         }
//     },
//     d: null
// }

// const result1 = deepClone(obj)
// obj.a = 11
// obj.b[0] = 11
// obj.c.a[0] = 11
// console.log(obj)
// console.log(result1)


// function
function func(a, b, c){
  return a * b * c;
}
let closeFunc = new Function('return '+ func.toString())()

console.log(func)

let funA = func
let funB = func
console.log(funA === funB)


console.log(closeFunc)

console.log(funA === closeFunc)
