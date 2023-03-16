/**
 * @Description 定义全局单例接收器对象 获取从外部注入的axios/router/store
 * @example const receiver =  new Receiver()
 */
export default class Receiver {
  //当前类名
  static $name = "Receiver";
  //Receiver别名
  static $ = Receiver;
  constructor($http, router, store) {
    //首次使用构造器实例
    if (!Receiver.instance) {
      this.name = Receiver.$name;
      this.$ = Receiver.$;
      this.$http = $http;
      this.router = router;
      this.store = store;
      Receiver.instance = this;
    }
    return Receiver.instance;
  }
  //静态方法 获取实例
  static getInstance($http, router, store) {
    if (!this.instance) {
      //实例化
      this.instance = new Receiver($http, router, store);
    }
    return this.instance;
  }
}