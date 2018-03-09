export default {
  /**
   * 自定义指令 拖动改变元素宽高
   * @example
   * v-drag:dialog-head.y="onDrag"
   * @param {string} :dialog-head 触发拖动的元素class
   * @param {string} .y .x 拖动方向
   * @param {function} onDrag(dragStatus) 拖动完成触发事件 dragStatus为最终元素宽高
   */
  drag: {
    // dom渲染完成并插入后
    inserted(el, binding, vnode) {
      // 拖动触发元素 拖动方向 回调函数
      const trigger = el.getElementsByClassName(binding.arg)[0]
      const dragTo = Object.keys(binding.modifiers).join();
      if (dragTo === 'y') {
        trigger.style.cursor = 'n-resize'
      } else {
        trigger.style.cursor = 'e-resize'
      }
      // 拖动元素宽高 diff表示点击坐标与绑定元素坐标偏移量 防止第一次点击将绑定元素高度直接设置为点击坐标,造成闪烁
      const dragStatus: any = {};
      const diff = { x: 0, y: 0 };
      trigger.addEventListener('mousedown', (e: any) => {
        diff.y = e.clientY - el.offsetTop;
        diff.x = e.clientX - el.offsetLeft;
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
      })

      const windowH = window.innerHeight;
      const windowW = window.innerWidth;

      // 拖动
      function doDrag(e) {
        if (e.which !== 1) {
          stopDrag()
        }
        dragStatus.width = windowW - e.clientX + diff.x
        dragStatus.height = windowH - e.clientY + diff.y
        if (dragTo === 'y') {
          el.style.height = dragStatus.height + 'px';
        } else {
          el.style.width = dragStatus.width + 'px';
        }
      }

      // 拖动结束 执行回调
      const cb: (dragStatus: any) => void = binding.value;

      function stopDrag() {
        cb(dragStatus);
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
      }
    }
  },
}
