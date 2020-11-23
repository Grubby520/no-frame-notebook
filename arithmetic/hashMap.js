class MyHashMap {
    constructor() {
        // return Object.create(null)
    }

    put(key, value) {
        this[key] = value
    }

    get(key) {
        return this[key]
    }

    remove(key) {
        delete this[key]
    }
}

/**
 * Your MyHashMap object will be instantiated and called as such:
    MyHashMap hashMap = new MyHashMap();
    hashMap.put(1, 1);          
    hashMap.put(2 , 2);         
    hashMap.get(1);            // 返回 1
    hashMap.get(3);            // 返回 -1 (未找到)
    hashMap.put(2, 1);         // 更新已有的值
    hashMap.get(2);            // 返回 1 
    hashMap.remove(2);         // 删除键为2的数据
    hashMap.get(2);            // 返回 -1 (未找到) 
 */

 const hashMap = new MyHashMap()
 hashMap.put(1, 1)
 console.log(hashMap.get(1))
hashMap.remove(1)
 console.log(hashMap.get(1))