// const arr = [1,2,3]
// forOf(arr)
// forIn(arr)

// const obj = {
//     a: 1,
//     b: 2
// }
// forIn(obj)


// function forOf (arr) {
//     for (const i of arr) {
//         console.log(i)
//     }
// }
// function forIn (arr) {
//     for (const i in arr) {
//         console.log(i)
//     }
// }

var foo = {
    a: [],
    put(k) {this.a.push(k)}
}

var Foo1 = Object.create(foo)
console.log(Foo1.a)
Foo1.get = function() {return this.a}
Foo1.put(2)
console.log(Foo1.get())

console.log(foo.__proto__ === foo)


a = function () {this.a = 1}
b - new a()
a.prototype.obj = {}
a.prototype.isPrototypeOf(b)
Object.prototype.isPrototypeOf(a)
b instanceof a
Object.getPrototypeOf(b) === a.prototype
b.constructor === a.prototype.constructor