/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'
import config from '../config'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep { // 发布者
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>; // 订阅者

// 每一个发布者都有订阅者的实例

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      // 为其订阅者增加依赖
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    if (process.env.NODE_ENV !== 'production' && !config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort((a, b) => a.id - b.id)
    }
    // 循环调用所有收集的Watch对象中的回调函数：
    for (let i = 0, l = subs.length; i < l; i++) {
      // 关键，调用订阅者的update方法
      subs[i].update()
    }
  }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
// 目标堆栈
const targetStack = []
// 入栈
export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
// 出栈（先进先出）
export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}
