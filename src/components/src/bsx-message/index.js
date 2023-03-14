/*
 * 提示框插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import Confirm from '../bsx-confirm';
import config from './config';
import {
	createRandomUid,
	isPlainObject,
	isFunction,
	extend
} from '@/utils/tool';

class Message {
	constructor(ops){
		this.id=createRandomUid();
		ops=extend(true,{},this.getDefault(),ops);
		this.ops=extend(true,ops,{
	    	button:[
				{
					text:'确认',
					'class':'blue',
					plain:true,
					callback:node=>{
						this.sure(node);
					}
				}
			],
			autoClose:ops.autoClose,
			closeable:ops.closeable,
			closeCallback:({node,close})=>{
				ops.close&&ops.close(node);
			}
		});
	}
    /*
     * 初始化
     */
    init(){
		this.args=[].slice.call(arguments,0);
		this.confirm=new Confirm(this.ops);
		Message.cache=Message.cache||{};
		Message.cache[this.id]=this;
		return this.confirm.init.apply(this.confirm,this.args);
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
     * 确认
     */
	sure(node){
		this.ops.autoClose&&this.close();
		this.confirm.confirmInstance.handleSure(node);
	}
    /*
     * 关闭message
     */
	close(){
		this.confirm.close();
		if(Message.cache&&Message.cache[this.id]){
			delete Message.cache[this.id];
		};
		return this;
	}
    /*
     * 销毁
     */
    destroy(){
        delete this;
    }
};

Message.close=()=>{
    Object.keys(Message.cache).map(id=>{
        Message.cache[id]&&Message.cache[id].close();
    });
};

export default Message;
