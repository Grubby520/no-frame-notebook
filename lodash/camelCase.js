/* @flow */

/**
 * 捕获连续的字母数字字符串数组，再从第二个元素开始，把值首字母转成大写
 */

export default function (str: string): string {
  return str;
}

const { camelCase } = require("lodash");

console.log(camelCase("Foo Bar"));
// => 'fooBar'

console.log(camelCase("--foo-bar--"));
// => 'fooBar'

console.log(camelCase("__FOO_BAR__"));
// => 'fooBar'
