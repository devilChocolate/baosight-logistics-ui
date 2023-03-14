/*
 * bsx-ui 组件库
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Dialog from './src/bsx-dialog';
import Confirm from './src/bsx-confirm';
import Message from './src/bsx-message';
import Toast from './src/bsx-toast';
import Loading from './src/bsx-loading';
import Result from './src/bsx-result';
import DialogComponent from './src/bsx-dialog/src';
import ScrollbarComponent from './src/bsx-scrollbar';
import ResultComponent from './src/bsx-result/src';
import LoadingComponent from './src/bsx-loading/src';

let bsxUI={
	Dialog,
	Confirm,
	Message,
	Toast,
	Loading,
	Result
};

let components={
	DialogComponent,
	ScrollbarComponent,
	ResultComponent,
	LoadingComponent
};

export default {
	install(Vue,options){
		Object.keys(bsxUI).map(key=>{
			let name=key.replace(/^[A-Z]/g,function(a,b){
			   return `$$${a.toLowerCase()}`;
		    });
			Vue.prototype[name]=function(ops){
				let instance=new bsxUI[key](ops);
				return instance.init.apply(instance,[].slice.call(arguments,1));
			};
			Vue.Components=Vue.Components||{};
			Vue.Components[key]=bsxUI[key];
			Vue.prototype[name][key]=bsxUI[key];
		});
		Object.keys(components).map(key=>{
			Vue.component(components[key].name,components[key]);
		});
	}
};
