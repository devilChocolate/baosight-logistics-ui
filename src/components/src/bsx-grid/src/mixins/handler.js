/*
 * grid handler混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
    isFunction
} from '@/utils/tool';
import {
    addResizeListener,
    removeResizeListener
} from '@/utils/resize';

export default {
    data(){
        return {
            clickRowIndex:null,
            scrollHorizontalState:null
        };
    },
    props:{

    },
    created(){

    },
    mounted(){
        this.isChildGrid&&addResizeListener(this.$el,this.handleChildResize);
    },
    methods:{
        /*
         * 监听子表格
         */
        handleChildResize(){
            if(this._parentGrid){
                this._parentGrid.refreshTableBodyRowsHeight('childGridResize');
            };
        },
        /*
         * 折叠展开
         */
        handleRowExpand(row,index){
            if(row.expanding){
                return this.$message('正在加载中，请勿重复点击！');
            };
            if(row.expand){
                const expandGrid=this.getExpandChildGrid(index);
                if(expandGrid){
                    const editData=expandGrid.getEditRowsValue();
                    //expandGrid.list  这里可以精确匹配每个单元格是否有修改
                    if(editData.length){
                        this.showConfirm({
                            content:'检测到有修改且尚未保存，确认放弃保存吗？',
                            sure:({node,close})=>{
                                close();
                                expandGrid.resetEditRows();
                                this.$set(this.list,index,{
                                    ...row,
                                    expand:false,
                                    expanding:false
                                });
                            }
                        });
                    }else{
                        this.$set(this.list,index,{
                            ...row,
                            expand:false,
                            expanding:false
                        });
                    };
                }else{
                    this.$set(this.list,index,{
                        ...row,
                        expand:false,
                        expanding:false
                    });
                };
            }else if(row.children==null&&isFunction(this.expandChange)){
                this.$set(this.list,index,{
                    ...row,
                    expanding:true
                });
                this.expandChange({row,index},data=>{
                    if(data&&data.length){
                        this.$set(this.list,index,{
                            ...row,
                            expanding:false,
                            children:data,
                            expand:true
                        });
                        this.$nextTick(()=>{
                            this.setExpandChildComponent(index);
                        });
                    }else{
                        this.$set(this.list,index,{
                            ...row,
                            expanding:false
                        });
                        this.$message('没有查询到数据！');
                    };
                });
            }else if(row.children&&row.children.length){
                this.$set(this.list,index,{
                    ...row,
                    expanding:false,
                    expand:true
                });
                this.$nextTick(()=>{
                    this.setExpandChildComponent(index);
                });
            }else{
                this.$message('没有子集数据！');
            };
        },
        /*
    	 * 切换分页
    	 */
        handlePageChange(page){
            this._fetchPageIntercept({
                page:page,
                size:this.pageSize
            },()=>{
                this.deleteAddRows();
                this.getPageInfo(page);
            });
        },
        /*
    	 * 切换分页pageSize
    	 */
        handlePageSizeChange(size){
            this._fetchPageIntercept({
                page:this.currentPage,
                size:size
            },()=>{
                this.pageSize=size;
                this.deleteAddRows();
                this.getPageInfo(1);
            });
        },
        /*
    	 * 滚动事件
    	 */
        handleScroll({horizontal,vertical,scrollLeft,scrollTop},type,direction){
            if(direction=='head'){
                'left|center|right'.split('|').map(item=>{
                    if(item!=type){
                        this._fetchScroll(this.$refs[`body_${item}_scroll`],'top',scrollTop);
                    }else if(type=='center'){
                        this._fetchScroll(this.$refs[`${direction}_${item}_scroll`],'left',scrollLeft);
                        !this.isBorder&&this._getScrollState(scrollLeft,horizontal);
                    };
                });
            }else if(direction=='body'&&type=='center'){
                this._fetchScroll(this.$refs[`${direction}_${type}_scroll`],'left',scrollLeft);
                !this.isBorder&&this._getScrollState(scrollLeft,horizontal);
            };
            this.hideCellPopper();
        },
        /*
    	 * 辅助滚动
    	 */
        _fetchScroll(scroll,direction,value){
            if(scroll){
                scroll.disabledScrollEmit();
                scroll.scrollTo({
                    [direction]:value
                });
                scroll._timer&&clearTimeout(scroll._timer);
                scroll._timer=setTimeout(scroll.enabledScrollEmit,1000);
            };
        },
        /*
    	 * 获取横向滚动状态
    	 */
        _getScrollState(scrollLeft,horizontal){
            this.$nextTick(()=>{
                if(scrollLeft==0){
                    this.scrollHorizontalState={
                        left:0,
                        right:this.lockedCenterWidth!=null
                    };
                }else if(horizontal){
                    this.scrollHorizontalState={
                        left:1,
                        right:0
                    };
                }else{
                    this.scrollHorizontalState={
                        left:1,
                        right:1
                    };
                };
            });
        },
        /*
    	 * 全选
    	 */
        handleCheckBoxChange(val){
            val?this.setCheckedRows():this.cancelCheckedRows();
            this.$emit('bsx-grid-check-change',{
                rows:this.getCheckedDisAddRowsValue()
            });
            if(this.isChildGrid&&!this.isHasChildExpand){
                if(this._parentGrid){
                    if(val){
                        this._parentGrid.setCheckedRow(this._expandChildIndex);
                    }else{
                        this._parentGrid.cancelCheckedRow(this._expandChildIndex);
                    };
                };
                return;
            };
            this.list.forEach((item,index)=>{
                this.handleParentGridChange(index);
            });
        },
        /*
    	 * 单元格值改变
    	 */
        handleCellChange(index,col,row,{value},flag){
            if(row.disabled){
                return;
            };
            if(this.checkType=='radio'){
                for(let i=0;i<this.list.length;i++){
                    if(this.list[i].disabled&&this.list[i].checked){
                        this._fetchCheckRow(this._getIndex(index,row.addabled),value);
                        this.$nextTick(()=>{
                            this._fetchCheckRow(this._getIndex(i),value);
                        });
                        this.$message('当前存在单选禁用选中行！');
                        return;
                    };
                };
            };
            let list=row.addabled?this.adds:this.list;
            list[index][col.prop]=value;
            if(this.checkType&&col.prop==this.checkType){
                this._fetchCheckRow(this._getIndex(index,row.addabled),value);
                this.$emit('bsx-grid-check-change',{
                    rows:this.getCheckedDisAddRowsValue()
                });
                this.handleParentGridChange(index,flag==undefined?true:flag);
            };
        },
        /*
    	 * 单击行
    	 */
        handleClickRow(index){
            if(this.list[index].disabled||this.list[index].editabled){
                return;
            };
            this.clickRowIndex=index;
            this.$emit('bsx-grid-click-row',{
                row:this.list[index]
            });
            return;
            if(this.checkRowTriggerClick&&this.list[index]&&!this.list[index].editabled&&this.checkType){
                if(this.checkType=='radio'&&this.list.some(item=>item.disabled&&item.checked)){
                    this.$message('当前存在单选禁用选中行！');
                    return;
                };
                this._fetchCheckRow(this._getIndex(index),this.checkType=='radio'?true:!this.list[index].checked);
                this.$emit('bsx-grid-check-change',{
                    rows:this.getCheckedDisAddRowsValue()
                });
                this.handleParentGridChange(index);
            };
        },
        /*
    	 * 父表格-选中/不选中
    	 */
        handleParentGridChange(index,flag){
            if(this.isChildGrid){
                if(this.list[index].checked){
                    if(this._parentGrid&&this._parentGrid.checkType){
                        this._parentGrid.handleCellChange(this._expandChildIndex,{
                            prop:this._parentGrid.checkType
                        },this._parentGrid.list[this._expandChildIndex],{
                            value:this.list[index].checked
                        },this.checkType=='radio');
                    };
                }else{
                    if(!this.list.filter(item=>item.checked).length){
                        this._parentGrid.cancelCheckedRow(this._expandChildIndex);
                    };
                };
            }else if(this.checkType){
                if(this.checkType=='checkbox'){
                    if(flag!=false){
                        const row=this.list[index];
                        if(!row.addabled&&row.expand){
                            const expandGrid=this.getExpandChildGrid(index);
                            if(expandGrid&&expandGrid.checkType){
                                if(expandGrid.checkType=='checkbox'){
                                    if(row.checked){
                                        expandGrid.setCheckedRows();
                                    }else{
                                        expandGrid.cancelCheckedRows();
                                    };
                                }else{
                                    if(!row.checked){
                                        expandGrid.list.forEach((item,i)=>{
                                            if(item.checked){
                                                expandGrid.cancelCheckedRow(i);
                                            };
                                        });
                                    };
                                };
                            };
                        };
                    };
                }else{
                    for(let i=0;i<this.list.length;i++){
                        const row=this.list[i];
                        if(row.checked){
                            const expandComponent=this.getExpandChildComponent();
                            if(expandComponent){
                                expandComponent.forEach(item=>{
                                    if(item.expandChildIndex!==i){
                                        if(isFunction(item._getGridComponent)){
                                            const expandGrid=item._getGridComponent();
                                            if(expandGrid){
                                                expandGrid.list.forEach((item,j)=>{
                                                    if(item.checked){
                                                        expandGrid.cancelCheckedRow(j);
                                                    };
                                                });
                                            };
                                        };
                                    };
                                });
                            };
                            break;
                        };
                    };
                };
            };
        },
        /*
    	 * 列排序改变
    	 */
        handleColumnSortChange({col,sort}){
            if(this.sortAxiosEnabled){
                this.$set(this.sortParam,col.prop,sort);
                this.refresh();
            }else{
                this.sortParam={
                    [col.prop]:sort
                };
                this.setSortRows();
            };
        },
        /*
    	 * 列宽度改变
    	 */
        handleColumnWidthChange({col,size}){
            this.setColumnProps({
                [col.prop]:{
                    width:parseFloat(col.width)+size
                }
            },false);
        },
        /*
    	 * 滑入事件
    	 */
        handleMouseEnterRows({index,isAdd}){
            this.addTableRowsBgClass(index,'hover',isAdd);
        },
        /*
    	 * 滑出事件
    	 */
        handleMouseLeaveRows({index,isAdd}){
            this.removeTableRowsBgClass(index,'hover',isAdd);
        }
    },
    beforeDestroy(){
        this.isChildGrid&&removeResizeListener(this.$el,this.handleChildResize);
    }
};
