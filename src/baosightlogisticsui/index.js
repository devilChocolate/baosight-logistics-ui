import Dialog from "@/components/bsx/src/bsx-dialog";
import Confirm from "@/components/bsx/src/bsx-confirm";
import Message from "@/components/bsx/src/bsx-message";
import Toast from "@/components/bsx/src/bsx-toast";
import Loading from "@/components/bsx/src/bsx-loading";
import Result from "@/components/bsx/src/bsx-result";
import Grid from "@/components/bsx/src/bsx-grid";
import FormComponent from "@/components/bsx/src/bsx-form";
import column from '@/components/bsx/src/bsx-grid/src/column';
import DialogComponent from "@/components/bsx/src/bsx-dialog/src";
import ScrollbarComponent from "@/components/bsx/src/bsx-scrollbar";
import ResultComponent from "@/components/bsx/src/bsx-result/src";
import LoadingComponent from "@/components/bsx/src/bsx-loading/src";
import Receiver from "@/utils/receiver"
let bsxUI = {
  Dialog,
  Confirm,
  Message,
  Toast,
  Loading,
  Result,
};

let components = {
  DialogComponent,
  ScrollbarComponent,
  ResultComponent,
  LoadingComponent,
  Grid,
  column,
  FormComponent
};

const styles = [
  {
    color:
      "color: #43bb88;font-size: 18px;font-weight: bold;text-decoration: underline;",
    text: "欢迎使用宝信物流组件",
  },
  {
    color:
      "color: #43bb88;font-size: 18px;font-weight: bold;text-decoration: underline;",
    text: "组件加载中...",
  },
  {
    color:
      "color: #43bb88;font-size: 12px;text-decoration: underline;",
    text: "组件加载完成",
  },
  {
    color:
      "color: red;font-size: 12px;text-decoration: underline;",
    text: "组件加载错误",
  },
];

const log = console.log;

const hoc = (Vue, $http, router, store) => {
  Object.keys(bsxUI).map((key) => {
    let name = key.replace(/^[A-Z]/g, function (a, b) {
      return `$$${a.toLowerCase()}`;
    });
    Vue.prototype[name] = function (ops) {
      let instance = new bsxUI[key](ops);
      return instance.init.apply(instance, [].slice.call(arguments, 1));
    };
    Vue.Components = Vue.Components || {};
    Vue.Components[key] = bsxUI[key];
    Vue.prototype[name][key] = bsxUI[key];
    Receiver.getInstance($http,router,store)
  });
  Object.keys(components).map((key) => {
    Vue.component(components[key].name, components[key]);
  });
  const { color, text } = styles[2];
  log(`%c${text}`,color);
};
const baosightlogisticsui = ({ Vue, $http, router, store }) => {
  const { color:startColor, text:startText } = styles[0];
  log(`%c${startText}`,startColor);
  if (!Vue || !$http || !router || !store) {
    const { color, text } = styles[3];
    log(`%c${text}`,color);
    return;
  }
  const { color, text } = styles[1];
  log(`%c${text}`,color);
  void hoc(Vue, $http, router, store);
};
export default baosightlogisticsui;
