// var string = "12345678"
// var reg = /(?!^)(?=(\d{3})+$)/g;
// var result = string.replace(reg, ',');
// console.log(result);

// const regexp = new RegExp(/(?!^)(?=(\d{3})+$)/, 'g')
// console.log(regexp)
// const result = regexp.exec(string)
// console.log(result)

// const reg1 = new RegExp(/(\d)(?=(?:\d{3})+$)/, 'g')

// console.log(reg1.exec(str1))
// const result1 = str1.replace(reg1, '$1,')
// console.log(result1)

function moneyFormatter(num) {
    num = +num
    if (!isNaN(num)) {
        const [int, dec] = num.toString().split('.')
        const reg = /(?!^)(?=(\d{3})+$)/g
        const front = int.replace(reg, ',')
        return dec ? [front, dec].join('.') : front
    } else {
        return '-'
    }
}

const a = moneyFormatter('123741')
console.log(a)