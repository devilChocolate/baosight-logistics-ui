/**
 * @Description 包装组件 将组件作为vue插件
 */
export function installUI(Vue = {}, elementList = []) {
  console.log(`%c${logStart}`, style);
  Vue &&
    typeof Vue.component === "function" &&
    Array.isArray(elementList) &&
    elementList.forEach((ele) => Vue.component(ele.name, ele)) &&
    console.log(`%c${logEnd}`, style);
}
