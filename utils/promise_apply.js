// 防止并发初始化,单例模式，promise实践(连接数据库)
class ConcurrentInit {
    constructor() {
        this.connectionPromise = null
    }

    connect() {
        // 只会在初始化的时候执行一次
        if (!this.connectionPromise) {
            this.connectionPromise = connectToDb()
        }
        return this.connectionPromise
    }

    connectToDB() {
        // ...
    }

    async getRecord(records) {
        const info = await this.connect() // 拿到的是同一个Promise结果，只会初始化执行一次
        return getRecordFromDB(records)
    }

    getRecordFromDB(records) {
        // ...
    }
}

// 查询
const instance = new ConcurrentInit()
// 初始化时，多次调用getRecord也不会多次调用connect接口，只有等到第一个promise被settled之后，才会继续执行
instance.getRecord(1)
instance.getRecord([1, 2])
