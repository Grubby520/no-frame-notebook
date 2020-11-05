/**
 * 首次完成时间: 1h-1.5h
 * 给定一个“扁平化”字典对象,其键以点分隔。
    例如,{'A':1,'B.A':2,'B.B':4,'CC.D.E':3,'CC.D.F':5},
    实现将其转换为“嵌套”字典对象的功能。
    在上述情况下,嵌套版本如下:
    {
        'A':1,
        'B':{
            'A': 2,
            'B':4
        },
        'CC':{
            'D':{
                'E':3,
                'F':5
            }
        }
    }
 */

function objectFlattening(obj) {
    const newObj = {}
    let tempObj = null
    Object.keys(obj).forEach(key => {
        debugger
        tempObj = null
        const value = obj[key]
        const arr = key.split('.')
        arr.forEach((_key, index) => {
            const _value = index === arr.length - 1 ? value : {}
            tempObj = addSubKey(tempObj, _key, _value)
        })
    })

    return newObj

    function addSubKey(obj, key, value) {
        obj === null ? obj = newObj : null
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = value
        }
        return obj[key]
    }
}

const obj = {'A':1,'B.A':2,'B.B':4,'CC.D.E':3,'CC.D.F':5}

console.log(objectFlattening(obj))
