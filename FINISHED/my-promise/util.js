export function isFunction(x) {
    return typeof x === 'function'
}

export function isMaybeThenable(x) {
    return x !== null && typeof x === 'object'
}

let _isArray
if (Array.isArray) {
    _isArray = Array.isArray
} else {
    _isArray = x => getDataType(x) === '[object Array]'
}

export const isArray = _isArray

export function getRandomString() {
    return Math.random().toString(32).substring(2)
}

export function getDataType(data) {
    return Object.prototype.toString.call(data)
}
