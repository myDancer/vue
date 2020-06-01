/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  
  // use 其实就是一个执行器而已，执行接收到的第一个参数，并把第二个以上的参数传给第一个参数

  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 防止重复安装plugin
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 第二个参数起是插件的参数
    const args = toArray(arguments, 1)
    args.unshift(this)
    // 所以plugin里面一定要包含install参数
    if (typeof plugin.install === 'function') {
      // 执行install方法，并把参数传给install方法
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 如果没有install方法，则执行自身，并把参数传给它
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
