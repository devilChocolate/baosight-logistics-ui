/*
 * Toast框插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import toast from './src';
import config from './config';
import {
	createRandomUid,
	isPlainObject,
	isFunction,
	extend
} from '@/utils/tool';

class Toast {
	constructor(ops){
		this.id=createRandomUid();
		let position=ops.target?'absolute':'fixed';
		this.ops=extend(true,{},this.getDefault(),ops);
		this.ops.position=position;
	}
    /*
     * 初始化
     */
    init(){
		this.args=[].slice.call(arguments,0);
		if(this.ops.content&&this.ops.content.length){
			this.toastInstance=this.registerComponent();
			this.ops.target.appendChild(this.toastInstance.$el);
			this.show();
			Toast.cache=Toast.cache||{};
			Toast.cache[this.id]=this;
		};
		return this;
	}
	/*
	 * 获取默认数据
	 */
	getDefault(){
		let o={};
		Object.keys(config).map(key=>{
			o[key]=isPlainObject(config[key])?isFunction(config[key].default)?config[key].default():config[key].default:null;
		});
		return o;
	}
	/*
	 * 注册内置组件并绑定数据
	 */
	registerComponent(){
		let	toastContructor=Vue.extend({
			...toast,
			router,
			store
		});
		return new toastContructor({
			propsData:{
				content:this.ops.content,
				status:this.ops.status,
				delay:this.ops.delay,
				position:this.ops.position
			},
			methods:{
				__remove:this.remove.bind(this)
			}
		}).$mount();
	}
    /*
     * 移除toast
     */
    remove(){
        if(this.toastInstance){
			this.toastInstance.$destroy();
			delete Toast.cache[this.id];
			this.toastInstance.$el.parentNode.removeChild(this.toastInstance.$el);
            this.ops.callback&&this.ops.callback.apply(this,this.args);
        };
    }
	/*
     * 显示toast
     */
	show(){
		this.toastInstance&&this.toastInstance.show();
		return this;
	}
    /*
     * 关闭toast
     */
	close(){
		this.toastInstance&&this.toastInstance.close();
		return this;
	}
    /*
     * 销毁
     */
    destroy(){
        delete this;
    }
};

Toast.close=()=>{
    Object.keys(Toast.cache).map(id=>{
        Toast.cache[id]&&Toast.cache[id].close();
    });
};

export default Toast;
