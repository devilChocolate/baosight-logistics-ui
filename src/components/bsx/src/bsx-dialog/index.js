/*
 * 自定义弹出框插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import store from '@/store';
import router from '@/router';
import dialog from './src';
import config from './config';
import {
	createRandomUid,
	isPlainObject,
	isFunction,
	extend,
	cancelRequest
} from '@/utils/tool';

class Dialog {
	constructor(ops){
		this.id=createRandomUid();
		this.ops=extend(true,{},this.getDefault(),ops);
	}
    /*
     * 初始化
     */
    init(){
		this.args=[].slice.call(arguments,0);
		this.getInstanceComponent().then(component=>{
			this.dialogInstance=this.registerDialogComponent();
			this.dialogInstance.$el.id=this.id;
			this.component=this.registerInstanceComponent(component);
			this.dialogInstance.component=this.component;
			this.dialogInstance.$refs.main.$refs.resize.appendChild(this.component.$el);
			(this.ops.target||document.body).appendChild(this.dialogInstance.$el);
			Dialog.cache=Dialog.cache||{};
	        Dialog.cache[this.id]=this;
		});
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
	 * 获取内置组件
	 */
	getInstanceComponent(){
		return new Promise((resolve,reject)=>{
			if(isFunction(this.ops.component)){
				 this.ops.component().then(component=>{
					 resolve(component.default);
				 });
			}else{
				resolve(this.ops.component);
			};
        });
	}
	/*
	 * 注册弹出框组件并绑定数据
	 */
	registerDialogComponent(){
		let dialogContructor=Vue.extend({
			...dialog,
		   router,
		   store
	    });
		return new dialogContructor({
			data:()=>({
 			    args:this.args
		    }),
			propsData:{
				slotTitle:this.ops.slotTitle,
				target:this.ops.target,
				width:this.ops.width,
				closeable:this.ops.closeable,
				title:this.ops.title,
				dragable:this.ops.dragable,
				button:this.ops.button
			},
			methods:{
				remove:this.remove.bind(this),
				enter:this.enter.bind(this),
				scroll:this.scroll.bind(this),
				handleDrag:this.handleDrag.bind(this)
			}
		}).$mount();
	}
	/*
	 * 注册内置组件并绑定数据
	 */
	registerInstanceComponent(instance){
		let instanceContructor=Vue.extend({
			...instance,
			router,
			store
		});
		return new instanceContructor({
			data:()=>({
				isDialog:true,
				dialog:this.dialogInstance
			}),
			propsData:this.ops.data||{},
			methods:{
				$showLoading:this.dialogInstance.showLoading,
				$showContent:this.dialogInstance.showContent,
				$close:this.dialogInstance.close,
				$hide:this.dialogInstance.hide,
				$show:this.dialogInstance.show
			}
		}).$mount();
	}
	/*
     * 进入dialog
     */
	enter(){
		if(this.dialogInstance){
            this.ops.callback&&this.ops.callback.apply(this,this.args);
        };
	}
    /*
     * 移除dialog
     */
    remove(){
        if(this.dialogInstance){
			this.dialogInstance.$destroy();
			delete Dialog.cache[this.id];
			this.dialogInstance.$el.parentNode.removeChild(this.dialogInstance.$el);
            this.ops.closeCallback&&this.ops.closeCallback.apply(this,this.args);
        };
    }
	/*
     * dialog-滚动条滚动
     */
	scroll(data,instance){
		if(this.dialogInstance){
            this.ops.scrollBack&&this.ops.scrollBack.apply(this,[data,instance].concat(this.args));
        };
	}
	/*
     * dialog-滚动条滚动
     */
	handleDrag(instance){
		if(this.dialogInstance){
            this.ops.dragBack&&this.ops.dragBack.apply(this,[instance].concat(this.args));
        };
	}
	/*
     * 显示dialog
     */
	show(){
		this.dialogInstance&&this.dialogInstance.show();
		return this;
	}
	/*
     * 隐藏dialog
     */
	hide(){
		this.dialogInstance&&this.dialogInstance.hide();
		return this;
	}
    /*
     * 关闭dialog
     */
	close(){
		this.dialogInstance&&this.dialogInstance.close();
		return this;
	}
    /*
     * 销毁
     */
    destroy(){
        delete this;
    }
};

Dialog.close=()=>{
    Object.keys(Dialog.cache).map(id=>{
        Dialog.cache[id]&&Dialog.cache[id].close();
    });
};

export default Dialog;
