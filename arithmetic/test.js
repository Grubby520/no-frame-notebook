const obj1 = {a:1}

function change(obj) {
    const a = {c:1}
    Object.assign(obj,a)
    resultFn(obj)
}

function resultFn(obj) {
    obj.a =2
}

change(obj1)
console.log(obj1)