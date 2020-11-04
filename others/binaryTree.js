/**
 * title: 求二叉树所有根到叶子路径组成的数字
 */
const root = {
    value: 1,
    left: {
        value: 2,
        left: {
            value: 4,
            left: {
                value: 6,
                left: null,
                right: null
            },
            right: {
                value: 8,
                left: null,
                right: null
            }
        },
        right: {
            value: 5,
            left: null,
            right: {
                value: 7,
                left: null,
                right: null
            }
        }
    },
    right: {
        value: 3,
        left: null,
        right: null
    }
}

// 递归遍历
function getPaths(root, path, list) {
    if (root !== null) {
        path += String(root.value)
        if (root.left === null && root.right === null) {
            list.push(path)
        } else {
            getPaths(root.left, path, list)
            getPaths(root.right, path, list)
        }
    }
}

// 求和
function getTotal(list) {
    return list.reduce((total, cur) => {
        return +cur + total
    }, 0)
}

let path = ''
const list = []
getPaths(root, path, list)
const total = getTotal(list)
console.log(list)
console.log(total)