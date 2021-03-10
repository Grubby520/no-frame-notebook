// const reg1 = new RegExp(/(\d)(?=(?:\d{3})+$)/, 'g')
// const result1 = '12354520'.replace(reg1, '$1,')

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