# vue响应式的实现
## 主要原理发布-订阅模式
* Object.defineProperty 作为观察者
* Dep类负责收集订阅者信息
* Watcher类即观察者实现里自动通知观察者反馈发布信息
* Compile类里遍历判断匹配元素并作相应操作