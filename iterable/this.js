{
    const obj = {
        init() {
            // console.log(this)
            this.setIn()
        },
        setIn() {
            // console.log('setIn')
        }
    }
    
    obj.init()
    
    // 精度问题 precision
    a = 0.1 + 0.2 - 0.3
    trusy = 0.1 + 0.2 - 0.3 < Number.EPSILON
    
    isNaN('fd') // true
    Number.isNaN('1f') // false
    
    -0 === 0
    /**
     * toPrimitive抽象操作的规则 拆封 (valueOf toString方法)
     * toNumber抽象操作的规则
     * toString抽象操作的规则
     */
    
    +new Date() === new Date().getTime() // true
    +new Date === new Date().getTime() // 构造函数不带参数，可以不写()
    +new Date() === Date.now()
    
    ~3 === -4 // ~x === -(x + 1)
    // 建议使用Boolean(a)和！! a来进行显式强制类型转换
    
    // 隐式强制类型转换
    const a1 = [1,2]
    a1 + a1 === "1,21,2";
    ([] + {}) === "[object Object]" // ?
    
    // 处理
    function foo() {}
    const temp = 3
    const hasTemp = Number(!!temp) // 转换成 0 / 1，取代逻辑判断&& || 
    hasTemp && foo() // 短路 代码压缩
    
    // == ===
    // ==检查值是否相等，===检查值和类型是否相等
    // ==允许在相等比较中进行强制类型转换，而===不允许
    /**
     * 11.9.3.1的最后定义了对象（包括函数和数组）的宽松相等==。两个对象指向同一个值时即视为相等，不发生强制类型转换
     * 11.9.3节中还规定，==在比较两个不同类型的值时会发生隐式强制类型转换，会将其中之一或两者都转换为相同的类型后再进行比较
     * 
     * 数字与字符串校验相等
     * 11.9.3.4-5: 如果Type(x)是数字，Type(y)是字符串，则返回x == ToNumber(y)的结果
     */
    
    /**
     * 数字与字符串校验相等
     * 11.9.3.4-5: 如果Type(x)是数字，Type(y)是字符串，则返回x == ToNumber(y)的结果
     */
    const a2 = '2', b2 = 2;
    a2 == b2 // toNumber(a) == b2 => 2 == 2
    
    /**
     * 布尔值与其他类型的值校验相等
     * 11.9.3.6-7: 如果Type(x)是布尔类型，则返回ToNumber(x) == y的结果
     */
    // (1) toNumber(b) == a2 => 1 == '2' false; (2) toNumber(b) == toNumber(a2) => 1 == 2 false
    '2' == true // false
    '1' == true // true
    '0' == false // true
    // 晦涩的问题
    '2' == true || '2' == false //永远不要与true或false做比较
    
    /**
     * null和undefined校验相等
     * 11.9.3.2-3: 如果x为null, y为undefined，则结果为true
     * null和undefined只与自己相等、全等；
     * null和undefined相等，不全等；
     * 其他值与null和undefined都不相等；
     */
    let a3
    null == a3 // true
    undefined == a3 // true
    
    null == undefined // true
    null === undefined // false
    
    a3 === undefined // true
    a3 === null // false

    /**
     * 非对象与对象校验相等
     * 11.9.3.8-9: 如果Type(x)是字符串或数字，Type(y)是对象，则返回x ==ToPrimitive(y)的结果
     */
    const a4 = 42, b1 = [42];
    a4 == b1 // a4 == ToPrimitive(b1) => 42 == '42'; a4 == toNumber(b1) => 42 == 42 // true
    // null undefined不能boxed
    null == Object(null) // Object(a4)返回常规对象{}clipboardShippingAddress

    /**
     * 特殊情况
     */
    Number.prototype.valueOf = function() {
        // debugger
        return 3
    }
    2 == 3 // false
    Number(2) == 3 // false
    new Number(2) == 3 // true

    // 实现 a == 2 && a == 3 （滥用，玩坏了）
    let i = 2
    Number.prototype.valueOf = function() {
        // debugger
        return i++
    }
    const num = new Number(2)
    if (num == 2 && num == 3) {
        // console.log('done')
    }

    // 晕头转向
    '1' == true
    1 == true
    '0' == false
    0 == false
    '' == false
    '' == 0
    '' == []
    0 == []
    1 == [1]
    // 按隐式算法的流程来理解
    ['0'] == false
    String(['0'])
    '0' == false
    Number(false)
    '0' == 0
    Number('0')
    0 == 0

    // toPrimitive
    const a5 = new String('1')
    new String('1') == 1
    a5.valueOf()
    a5.toString()
    '1' == 1

    // 变态辣 （! toBoolean规则，显式强制转行，并反转奇偶校验位）
    ![] == [] // true gg思密达
    Boolean([]) // true => 反转，false
    false == []
    String([])
    '' == false

    Number('\n') == 0
    0 == '\n'

    'true' == true
    Number(true)
    'true' == 1
    Number('true') // NaN
    NaN == 1 // false
    NaN == NaN // false

    /**
     * 抽象关系比较
     * 分为两个部分：比较双方都是字符串（后半部分）和其他情况（前半部分）
     * 如果双方都是字符串，按字母顺序来进行比较
     * 
     */
    const obj_1 = {index: 1}
    console.log(obj_1)
    obj_1.index = 2
    console.log(obj_1)

}
