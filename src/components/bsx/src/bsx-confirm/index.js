/*
 * 自定义确认框插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from "vue";
import confirm from "./src";
import config from "./config";
import {
  createRandomUid,
  isPlainObject,
  isFunction,
  extend,
} from "@/utils/tool";
import Receiver from "@/utils/receiver"
const receiver = Receiver.instance
class Confirm {
  constructor(ops) {
    this.id = createRandomUid();
    this.ops = extend(true, {}, this.getDefault(), ops);
  }
  /*
   * 初始化
   */
  init() {
    this.args = [].slice.call(arguments, 0);
    if (this.ops.content && this.ops.content.length) {
      this.confirmInstance = this.registerComponent();
      (this.ops.target || document.body).appendChild(this.confirmInstance.$el);
      Confirm.cache = Confirm.cache || {};
      Confirm.cache[this.id] = this;
    }
    return this;
  }
  /*
   * 获取默认数据
   */
  getDefault() {
    let o = {};
    Object.keys(config).map((key) => {
      o[key] = isPlainObject(config[key])
        ? isFunction(config[key].default)
          ? config[key].default()
          : config[key].default
        : null;
    });
    return o;
  }

  /*
   * 注册内置组件并绑定数据
   */
  registerComponent() {
    let confirmContructor = Vue.extend({
      ...confirm,
      router:receiver.router,
      store:receiver.store,
    });
    return new confirmContructor({
      propsData: {
        width: this.ops.width,
        title: this.ops.title,
        slotTitle: this.ops.slotTitle,
        icon: this.ops.icon,
        content: this.ops.content,
        button: this.ops.button,
        autoClose: this.ops.autoClose,
        sure: this.ops.sure,
        cancel: this.ops.cancel,
        closeable: this.ops.closeable,
        closeCallback: this.ops.closeCallback,
      },
    }).$mount();
  }
  /*
   * 关闭confirm
   */
  close() {
    this.confirmInstance && this.confirmInstance.close();
    if (Confirm.cache && Confirm.cache[this.id]) {
      delete Confirm.cache[this.id];
    }
    return this;
  }
  /*
   * 销毁
   */
  destroy() {
    delete this;
  }
}

Confirm.close = () => {
  Object.keys(Confirm.cache).map((id) => {
    Confirm.cache[id] && Confirm.cache[id].close();
  });
};

export default Confirm;
