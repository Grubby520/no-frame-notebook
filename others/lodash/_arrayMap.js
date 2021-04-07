/**
 * 实现数组的map函数
 * @param {Array} array
 * @param {Function} iterator
 * @returns Array
 */
import isArray from "./isArray";
export default function arrayMap(array, iterator) {
  if (!isArray(array)) return array; // 扩展-类型判断
  let index = -1,
    length = array == null ? 0 : array.length, // null判断
    result = Array(length); // 固定新数组的长度

  while (++index < length) {
    // while代替for循环，使用++index自增运算符
    // 扩展-类型判断
    result[index] =
      (typeof iterator === "function" &&
        iterator(array[index], index, array)) ||
      array[index]; // 支持3个参数 值、下标、数组本身
  }
  return result;
}
