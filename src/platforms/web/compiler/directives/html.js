/* @flow */

import { addProp } from 'compiler/helpers'

export default function html (el: ASTElement, dir: ASTDirective) {
  if (dir.value) {
    // 向el.prop添加数组元素
    addProp(el, 'innerHTML', `_s(${dir.value})`, dir)
  }
}
