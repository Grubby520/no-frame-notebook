/**
 * title: 实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多2个，完善Scheduler类
 */
class Scheduler {
    constructor() {
        this.taskQueue = []
    }
    add(promiseCreator) {
        this.taskQueue.push(promiseCreator)
    }
}

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler()
console.log(scheduler)
const addTask = (time, order) => {
    scheduler
        .add(() => timeout(time))
        // .then(() => console.log(order))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
// output: 2 3 1 4