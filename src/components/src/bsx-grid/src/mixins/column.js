/*
 * grid column混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
    LocalStorage
} from "@/utils/storage";

export default {
    data(){
        return {

        };
    },
    props:{

    },
    computed:{
        /*
    	 * 获取列属性-显示隐藏列表
    	 */
        getColumnsToggleShowList(){
            return Object.keys(this.sourceCol).filter(key=>{
                const col=this.sourceCol[key];
                return col.prop&&col.prop!=this.checkType;
            }).map(key=>{
                const col=this.sourceCol[key];
                return {
                    checked:col.visible,
                    value:col.prop,
                    title:col.label
                };
            });
        },
        /*
    	 * 获取列属性-排序列表
    	 */
        getColumnsOrderList(){
            let arr={
                left:[],
                center:[],
                right:[]
            };
            Object.keys(this.sourceCol).forEach(key=>{
                let col=this.sourceCol[key];
                if(col.prop&&col.prop!=this.checkType&&col.visible){
                    arr[col.locked].push({
                        title:col.label,
                        prop:col.prop,
                        sortIndex:col.sortIndex
                    });
                };
            });
            Object.keys(arr).forEach(type=>{
                let cols=arr[type];
                cols=cols.sort((a,b)=>{
                    return a.sortIndex>b.sortIndex?1:-1;
                });
            });
            return arr;
        }
    },
    watch:{

    },
    created(){

    },
    mounted(){
        this.$nextTick(()=>{
            this.initColumnOrder();
        });
    },
    methods:{
        /*
    	 * 列属性-筛选
    	 */
        handleColumnFilterChange({indexs}){
            this.list.map((row,index)=>{
                row.showabled=indexs.indexOf(index)===-1;
                return row;
            });
            this.list=this.list.splice(0,this.list.length,...this.list);
        },
        /*
    	 * 列属性-排序-初始化
    	 */
        initColumnOrder(){
            if(this.gridId&&!this.isChildGrid){
                const local=LocalStorage.read(`__grid_${this.$route.path}__${this.gridId}__`);
                if(local){
                    this.setColumnProps(local);
                };
            };
        },
        /*
    	 * 一键还原-列排序
    	 */
        restoreColumnOrder(){
            let o={};
            Object.keys(this._columns).forEach(key=>{
                o[key]={
                    sortIndex:this._columns[key].sortIndex
                };
            });
            this.setColumnProps(o);
        },
        /*
    	 * 一键还原-列显示隐藏
    	 */
        restoreColumnVisible(){
            let o={};
            Object.keys(this._columns).forEach(key=>{
                o[key]={
                    visible:this._columns[key].visible
                };
            });
            this.setColumnProps(o);
        },
        /*
    	 * 一键还原-列锁定
    	 */
        restoreColumnLocked(){
            let o={};
            Object.keys(this._columns).forEach(key=>{
                o[key]={
                    locked:this._columns[key].locked
                };
            });
            this.setColumnProps(o);
        },
        /*
    	 * 列属性改变-一键还原
    	 */
        handleRestore(type){
            // switch(type){
            //     case 'order' :
            //         this.restoreColumnOrder();
            //         break;
            //     case 'visible' :
            //         this.restoreColumnVisible();
            //         break;
            //     case 'locked' :
            //         this.restoreColumnLocked();
            //         break;
            //     default : break;
            // };
            this.setColumnProps(this._columns);
            this.saveColumnLocal();
        },
        /*
    	 * 列属性改变-锁定
    	 */
        handleColumnRadioChange({type,prop}){
            this.setColumnProps({
                [prop]:{
                    locked:type
                }
            });
            this.saveColumnLocal();
        },
        /*
    	 * 列属性改变-排序
    	 */
        handleColumnOrderChange({list}){
            let o={};
            Object.keys(list).forEach(type=>{
                list[type].forEach((col,i)=>{
                    o[col.prop]={
                        sortIndex:col.sortIndex
                    };
                });
            });
            this.setColumnProps(o);
            this.saveColumnLocal();
        },
        /*
    	 * 列属性改变-显示隐藏
    	 */
        handleColumnToggleShowChange({list}){
            let o={};
            list.forEach(col=>{
                o[col.value]={
                    visible:col.checked
                };
            });
            this.setColumnProps(o);
            this.saveColumnLocal();
        },
        /*
    	 * 列属性改变-保存本地
    	 */
        saveColumnLocal(){
            if(this.gridId){
                let o={};
                Object.keys(this.sourceCol).map(key=>{
                    o[key]={
                        visible:this.sourceCol[key].visible,
                        locked:this.sourceCol[key].locked,
                        sortIndex:this.sourceCol[key].sortIndex
                    };
                });
                LocalStorage.set(`__grid_${this.$route.path}__${this.gridId}__`,o);
            };
        }
    },
    components:{

    }
};
