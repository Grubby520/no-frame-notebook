function multiRequest(urls = [], maxNum = 5) {
  // 请求总数量
  const len = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(len).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve, reject) => {
    // 请求maxNum个
    while (count < maxNum) {
      next();
    }
    function next() {
      let current = count++;
      // 处理边界条件
      if (current >= len) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());
      url
        .then((res) => {
          // 保存请求结果
          result[current] = res;
          console.log(`完成 ${current}`, new Date().toLocaleString());
          // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        })
        .catch((err) => {
          console.log(`结束 ${current}`, new Date().toLocaleString());
          result[current] = err;
          // 请求没有全部完成, 就递归
          if (current < len) {
            next();
          }
        });
    }
  });
}

const api = new Promise((resolve) => {
  const random = Math.random() * 300
  setTimeout(() => {
    console.log('...')
    resolve('back')
  }, random)
})

let apis = []
apis.length = 100
apis.fill(api)

// multiRequest(apis, maxNum = 10)

const apiA = apis[0]

const apiA1 = apiA.then(res => {return 'thenPromise'})

console.log(apiA)
console.log(apiA1)

console.log(apiA === apiA1)

const apiA2 = apiA1.then(res => {return apis[1]})
console.log(apiA2)

console.log(apiA === apiA2)
// apiA2.then(res => 'acd')
// console.log(apiA2)
