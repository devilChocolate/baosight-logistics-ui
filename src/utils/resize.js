/*
 * 监听
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
const resizeHandler = (entries) => {
  for (let entry of entries) {
    let listeners = entry.target.__resizeListeners__ || [];
    if (listeners.length) {
      listeners.forEach((fn) => {
        fn();
      });
    }
  }
};

/*
 * 绑定监听
 */
export const addResizeListener = (element, fn) => {
  if (!element) {
    return;
  }
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = [];
    element.__ro__ = new ResizeObserver(resizeHandler);
    element.__ro__.observe(element);
  }
  element.__resizeListeners__.push(fn);
};

/*
 * 解除监听
 */
export const removeResizeListener = (element, fn) => {
  if (!element || !element.__resizeListeners__) {
    return;
  }
  element.__resizeListeners__.splice(
    element.__resizeListeners__.indexOf(fn),
    1
  );
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect();
  }
};
