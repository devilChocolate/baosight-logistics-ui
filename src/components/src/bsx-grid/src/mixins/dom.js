/*
 * grid dom混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
    getDomStyle
} from '@/utils/dom';

export default {
    data(){
        return {

        };
    },
    props:{

    },
    created(){

    },
    methods:{
        /*
    	 * 删除行背景色
    	 */
        removeTableRowsBgClass(index,color,isAdd){
            let rows=this.getTableRowsEl(index,isAdd);
            rows.map(el=>{
                let classname=el.className.split(String.fromCharCode(32));
                classname=classname.filter(name=>{
                    return name!=color;
                });
                el.className=classname.join(String.fromCharCode(32));
            });
        },
        /*
    	 * 添加行背景色
    	 */
        addTableRowsBgClass(index,color,isAdd){
            let rows=this.getTableRowsEl(index,isAdd);
            rows.map(el=>{
                el.className=[el.className,color].join(String.fromCharCode(32));
            });
        },
        /*
    	 * 获取指定行el
    	 */
        getTableRowsEl(index,isAdd){
            let m=0;
            if(!isAdd){
                for(let i=0;i<this.list.length;i++){
                    const row=this.list[i];
                    if(row.expand&&i<index){
                        m++;
                    };
                    if(i>=index){
                        break;
                    };
                };
            };
            index=this._getIndex(index,isAdd)+m;
            let rows=[],tables=this.getRowsTables('body');
            tables.map((table,i)=>{
                for(let i=0;i<table.$el.rows.length;i++){
                     const tr=table.$el.rows[i];
                     if(i==index){
                         rows.push(tr);
                     };
                };
            });
            return rows;
        },
        /*
    	 * 获取行块表格
    	 */
        getRowsTables(type){
            let table=[this.$refs[`${type}_center_table`]];
            if(this.head.left&&this.head.left.length){
                table.unshift(this.$refs[`${type}_left_table`]);
            };
            if(this.head.right&&this.head.right.length){
                table.unshift(this.$refs[`${type}_right_table`]);
            };
            return table;
        },
        /*
    	 * 刷新表格head行高度
    	 */
        refreshTableHeadRowsHeight(){
            const height=this.setTableRowsHeight(this.getRowsTables('head'),'head');
            if(height&&height[0]){
                this.headerHeight=height[0];
            };
        },
        /*
    	 * 刷新表格body行高度
    	 */
        refreshTableBodyRowsHeight(logType,time){
            // console.log('refreshTableBodyRowsHeight',logType)
            if(time){
                this.__refreshTimer&&clearTimeout(this.__refreshTimer);
                this.__refreshTimer=setTimeout(()=>{
                    this.setTableRowsHeight(this.getRowsTables('body'),'body');
                },time);
            }else{
                this.setTableRowsHeight(this.getRowsTables('body'),'body');
            };
        },
        /*
    	 * 设置表格行高度
    	 */
        setTableRowsHeight(tables,logType){
            // console.log('setTableRowsHeight',logType,tables)
            let res=[],result=[];
            tables.filter(item=>{
                return !!item;
            }).map((table,index)=>{
                res[index]=[];
                if(table.$el&&table.$el.rows&&table.$el.rows.length){
                    for(let i=0;i<table.$el.rows.length;i++){
                        const tr=table.$el.rows[i];
                        let h=[];
                        if(tr&&tr.cells&&tr.cells.length){
                            for(let j=0;j<tr.cells.length;j++){
                                const td=tr.cells[j];
                                let height=0,size=10;
                                if(td.getAttribute('data-expand')){
                                    size=0;
                                };
                                if(td&&td.children&&td.children[0]){
                                    const style=getDomStyle(td.children[0]);
                                    height=parseFloat(style.height)||0;
                                };
                                h.push(height+size+1);
                            };
                        };
                        res[index].push(Math.max(...h)||36);
                    };
                };
            });
            if(res.length){
                res[0].forEach((a,i)=>{
                    let arr=[];
                    res.map((b,j)=>{
                        arr.push(res[j][i]);
                    });
                    result.push(Math.max(...arr));
                });
                tables.filter(item=>{
                    return !!item;
                }).map(table=>{
                    for(let i=0;i<table.$el.rows.length;i++){
                        const tr=table.$el.rows[i];
                        tr.setAttribute('height',result[i]);
                    };
                });
                return result;
            };
        }
    },
    beforeDestroy(){
        this.__refreshTimer&&clearTimeout(this.__refreshTimer);
    }
};
