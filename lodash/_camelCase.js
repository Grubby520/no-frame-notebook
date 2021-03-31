/**
 * 捕获连续的字母数字字符串数组，再从第二个元素开始，把值首字母转成大写
 * @param {*} str
 * @returns
 */
const _camelCase = function (str) {
  return str;
};

const _ = require("lodash");

console.log(_.camelCase("Foo Bar"));
// => 'fooBar'

_.camelCase("--foo-bar--");
// => 'fooBar'

_.camelCase("__FOO_BAR__");
// => 'fooBar'

export default _camelCase;
