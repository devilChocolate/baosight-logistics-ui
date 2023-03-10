/*
 * dom 相关操作
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from "vue";

/*
 * 获取DOM样式
 */
export const getDomStyle = (el) => {
  if (el) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, null);
    } else {
      return el.currentStyle || el.style;
    }
  }
  return null;
};

/*
 * 获取scrollbar尺寸
 */
export const getScrollbarSize = () => {
  if (!Vue.__scrollBarSize__) {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    let barSize = widthNoScroll - widthWithScroll;
    Vue.__scrollBarSize__ = barSize;
  }
  return Vue.__scrollBarSize__;
};

/*
 * 绑定事件
 */
export const on = (() => {
  if (document.addEventListener) {
    return (element, event, handler, context) => {
      if (element && event && handler) {
        handler = context ? handler.bind(context) : handler;
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return (element, event, handler, context) => {
      if (element && event && handler) {
        handler = context ? handler.bind(context) : handler;
        element.attachEvent(`on${event}`, handler);
      }
    };
  }
})();

/*
 * 解绑事件
 */
export const off = (() => {
  if (document.removeEventListener) {
    return (element, event, handler, context) => {
      if (element && event && handler) {
        handler = context ? handler.bind(context) : handler;
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return (element, event, handler, context) => {
      if (element && event && handler) {
        handler = context ? handler.bind(context) : handler;
        element.detachEvent(`on${event}`, handler);
      }
    };
  }
})();
