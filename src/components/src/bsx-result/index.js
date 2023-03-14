/*
 * result插件
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import Vue from 'vue';
import result from './src';
import config from './config';

class Result {
	constructor(ops){
		this.ops=Object.assign({},this.getDefault(),ops);
        this.ops.target=this.ops.target||config.target.default;
	}
    /*
     * 初始化
     */
    init(){
        this.args=[].slice.call(arguments,0);
		this.bindContainerData();
        this.ops.target.appendChild(this.resultInstance.$el);
        this.resultInstance.show();
        return this;
    }
    /*
     * 获取默认数据
     */
	getDefault(){
		let o={};
		Object.keys(config).map(key=>{
			o[key]=config[key].default;
		});
		return o;
	}
    /*
	 * 绑定result数据
	 */
	bindContainerData(){
		let resultComponent=Vue.extend(result);
		this.resultInstance=new resultComponent({
			propsData:{
                ...this.ops,
                id:this.id
			},
			methods:{
				refresh:this.refresh.bind(this),
				remove:this.remove.bind(this)
			}
		}).$mount();
	}
    /*
     * 移除result
     */
    remove(){
        if(this.resultInstance){
            this.resultInstance.$el.parentNode.removeChild(this.resultInstance.$el);
            delete this.resultInstance;
        };
    }
	/*
     * 重新加载
     */
	refresh(){
		this.ops.refreshCallBack&&this.ops.refreshCallBack.apply(this,this.args);
	}
	/*
     * 设置结果信息
     */
	set(msg){
		if(this.resultInstance){
			this.resultInstance.msg=msg;
		};
		return this;
	}
	/*
     * 显示result
     */
	show(){
		this.resultInstance&&this.resultInstance.show();
		return this;
	}
    /*
     * 隐藏result
     */
	hide(){
		this.resultInstance&&this.resultInstance.hide();
		return this;
	}
    /*
     * 关闭result
     */
	close(){
		this.resultInstance&&this.resultInstance.close();
		return this;
	}
    /*
     * 销毁
     */
    destroy(){
        delete this;
    }
};

export default Result;
