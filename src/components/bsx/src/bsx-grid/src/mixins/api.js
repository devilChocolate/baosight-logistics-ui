/*
 * grid api混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
    isFunction,
    isArray,
    extend,
    isPlainObject
} from '@/utils/tool';

export default {
    data(){
        return {

        };
    },
    props:{

    },
    watch:{

    },
    computed:{

    },
    created(){

    },
    methods:{
        /*
         * 更新静态数据
         */
        update(index,row,props){
            if(this.dataSource){
                this._dataSource.splice(this.pageSize*(this.currentPage-1)+Number(index),1,{
                    ...this._getRow(index),
                    ...row,
                    ...props
                });
            };
        },
        /*
    	 * 设置列属性
         * @props    属性对象集合
    	 */
        setColumnProps(props,isResetScroll=true){
            if(isPlainObject(props)){
                let o={
                    left:[],
                    center:[],
                    right:[]
                },arr=[],flag=false;
                Object.keys(props).forEach(key=>{
                    if(this.sourceCol[key]&&isPlainObject(props[key])){
                        Object.keys(props[key]||{}).forEach(prop=>{
                            if(this.sourceCol[key].hasOwnProperty(prop)){
                                if(this.sourceCol[key][prop]!=props[key][prop]){
                                    flag=true;
                                    this.sourceCol[key][prop]=props[key][prop];
                                    if(prop=='locked'){
                                        this.sourceCol[key].sortIndex=999;
                                    };
                                };
                            };
                        });
                    };
                });
                if(flag){
                    Object.keys(this.head).forEach(locked=>{
                        this.head[locked].forEach(col=>{
                            const sourceCol=this.sourceCol[col.prop];
                            if(sourceCol){
                                Object.keys(sourceCol).forEach(prop=>{
                                    if(col.hasOwnProperty(prop)){
                                        col[prop]=sourceCol[prop];
                                    };
                                });
                            };
                            arr.push(col);
                        });
                    });
                    arr.forEach(col=>{
                        o[col.locked].push(col);
                    });
                    Object.keys(o).forEach(locked=>{
                        o[locked]=o[locked].sort((a,b)=>{
                            return a.sortIndex>b.sortIndex?1:-1;
                        }).map((item,i)=>{
                            if(this.sourceCol[item.prop]&&!this.sourceCol[item.prop].unSortIndex){
                                this.sourceCol[item.prop].sortIndex=i;
                            };
                            return {
                                ...item,
                                sortIndex:item.unSortIndex?item.sortIndex:i
                            };
                        }).sort((a,b)=>{
                            return a.sortIndex>b.sortIndex?1:-1;
                        });
                    });
                    this.head=o;
                    if(isResetScroll){
                        this._resetScrollLeft();
                        this._resetScrollTop();
                    };
                    this.lockedCenterWidth=this.getLockedCenterWidth();
                    this.$nextTick(()=>{
                        this.refreshTableHeadRowsHeight();
                        this.refreshTableBodyRowsHeight('setColumnProps');
                    });
                };
            };
        },
        /*
    	 * 新增行 单选已存在新增行则不能继续新增
    	 */
        addRow(){
            const row=this._creatAddRowEmptyData();
            let adds=this.getAddRowsValue();
            if(this.checkType=='radio'&&adds.length){
                return;
            };
            this.hideCellPopper();
            this.adds.unshift(row);
            this.$nextTick(()=>{
                this.adds.forEach((item,i)=>{
                    this.setRowValue(i,i?adds[i-1]:row,true);
                });
            });
            this._resetScrollTop();
        },
        /*
    	 * 删除选中新增行
    	 */
        deleteCheckedAddRows(){
            const rows=this._filterCheckedAddRows();
            if(!Object.keys(rows.adds).length){
                this.showMessages('请至少选中1行');
            }else{
                this._handleDeleteAddRows(rows.adds);
            };
        },
        /*
    	 * 删除全部新增行
    	 */
        deleteAddRows(){
            const rows=this._filterAddRows();
            this._handleDeleteAddRows(rows.adds);
        },
        /*
    	 * 删除指定新增行
         * @index    第几行
    	 */
        deleteAddRow(index){
            this._handleDeleteAddRows({
                [index]:this.adds[index]
            });
        },
        /*
    	 * 删除选中行[包含新增行]
         * @return   promise
    	 */
        deleteCheckedRows(){
            return new Promise((resolve,reject)=>{
                const rows=this._filterCheckedRows();
                if(this._hasRows(rows)||!!Object.keys(this.historyChecks).length){
                    const disAddlRows=this._filterCheckedDisAddRows();
                    const addRows=this.getCheckedAddRows();
                    let paramRows=this._Object2Array(disAddlRows),hisRows=[];
                    Object.keys(this.historyChecks).map(id=>{
                        if(paramRows.length){
                            for(let i=0;i<paramRows.length;i++){
                                const _id=this._getRowFilterId(paramRows[i]);
                                if(id!=_id){
                                    hisRows.push(this.historyChecks[id]);
                                };
                            };
                        }else{
                            hisRows.push(this.historyChecks[id]);
                        };
                    });
                    paramRows=paramRows.concat(hisRows);
                    if(paramRows.length){
                        this._fetchDeleteDisAddRows(paramRows).then(()=>{
                            addRows.length&&this.deleteCheckedAddRows();
                            this._removeRowsData(disAddlRows.list);
                            this._removeHistoryCheckRows(hisRows);
                            this.refresh();
                            resolve();
                        });
                    }else{
                        this.deleteCheckedAddRows();
                        resolve();
                    };
                }else{
                    this.showMessages('请至少选中1行');
                };
            });
        },
        /*
    	 * 删除指定行
         * @index    第几行
         * @isAdd    是否属于新增行
         * @return   promise
    	 */
        deleteRow(index,isAdd){
            return new Promise((resolve,reject)=>{
                const row=this._getRow(index,isAdd);
                if(row){
                    if(row.addabled){
                        this.deleteAddRow(index);
                        resolve();
                    }else{
                        this._fetchDeleteDisAddRows([row]).then(()=>{
                            this._removeRowsData({
                                [index]:row
                            });
                            this.refresh();
                            resolve();
                        });
                    };
                };
            });
        },
        /*
    	 * 保存新增选中编辑行
         * @return   promise
    	 */
        saveAddCheckedRows(){
            return this._handleSaveRows(this._filterCheckedAddRows());
        },
        /*
    	 * 保存新增编辑行
         * @return   promise
    	 */
        saveAddRows(){
            return this._handleSaveRows(this._filterAddRows());
        },
        /*
    	 * 保存选中编辑行[包含新增编辑行]
         * @return   promise
    	 */
        saveCheckedRows(){
            return this._handleSaveRows(this._filterCheckedEditRows());
        },
        /*
    	 * 保存全部编辑行[包含新增编辑行]
         * @return   promise
    	 */
        saveRows(){
            return this._handleSaveRows(this._filterEditRows());
        },
        /*
    	 * 保存编辑行
         * @index    第几行
         * @isAdd    是否属于新增行
         * @return   promise
    	 */
        saveRow(index,isAdd){
            return new Promise((resolve,reject)=>{
                const row=this._getRow(index,isAdd);
                if(row&&row.editabled){
                    this._fetchSaveRows({
                        [isAdd?'adds':'list']:{
                            [index]:row
                        }
                    }).then(()=>{
                        resolve();
                    });
                };
            });
        },
        /*
    	 * 设置单元格数据
         * @index     第几行
         * @prop      单元格对应key
         * @value     需要设置的值
         * @isAdd     是否属于新增行
    	 */
        setCellValue(index,prop,value,isAdd=false){
            this.setRowValue(index,{
                [prop]:value
            },isAdd);
        },
        /*
    	 * 设置行数据
         * @index     第几行
         * @data      需要设置的行数据
         * @isAdd     是否属于新增行
    	 */
        setRowValue(index,data,isAdd=false){
            let row=this._getRow(index,isAdd);
            data=this._mergeDependRowData(data,index);
            if(row){
                if(row.editabled){
                    const cells=this.getRowCellComponent(index,isAdd);
                    Object.keys(cells).map(key=>{
                        const cell=cells[key];
                        //if(this.cellState[index][cell.col.prop]){
                            if(data.hasOwnProperty(key)){
                                cell.component.reset&&cell.component.reset({
                                    value:data[cell.col.prop],
                                    title:data[cell.col.propTitle],
                                    code:data[cell.col.propCode]
                                });
                            };
                        //};
                    });
                }else{
                    Object.keys(data).forEach(key=>{
                        if(row.hasOwnProperty(key)){
                            row[key]=data[key];
                        };
                    });
                };
            };
        },
        /*
         * 获取新增选中行数据
         */
        getCheckedAddRowsValue(){
            return this._fetchFilterRowsValue(this._filterCheckedAddRows());
        },
        /*
    	 * 获取选中编辑行[包含新增行]数据
    	 */
        getCheckedEditRowsValue(){
            return this._fetchFilterRowsValue(this._filterCheckedEditRows());
        },
        /*
    	 * 获取编辑行[包含新增行]数据
    	 */
        getEditRowsValue(){
            return this._fetchFilterRowsValue(this._filterEditRows());
        },
        /*
    	 * 获取新增行数据
    	 */
        getAddRowsValue(){
            return this._fetchFilterRowsValue(this._filterAddRows());
        },
        /*
    	 * 获取选中非新增行数据
    	 */
        getCheckedDisAddRowsValue(){
            const rows=this._fetchFilterRowsValue(this._filterCheckedDisAddRows());
            return this._mergeCheckTotalRows(rows);
        },
        /*
    	 * 获取选中行数据
    	 */
        getCheckedRowsValue(){
            const rows=this._fetchFilterRowsValue(this._filterCheckedRows());
            return this._mergeCheckTotalRows(rows);
        },
        /*
    	 * 获取全部行数据[不包括新增]
    	 */
        getAllDisAddRowsValue(){
            return this._fetchFilterRowsValue(this._filterAllDisAddRows());
        },
        /*
    	 * 获取全部行数据[包括新增]
    	 */
        getAllRowsValue(){
            return this._fetchFilterRowsValue(this._filterAllRows());
        },
        /*
    	 * 获取单元格数据
         * @index     第几行
         * @prop      单元格对应key
         * @isAdd     是否属于新增行
         * @isActual  是否获取编辑状态下的实时数据
    	 */
        getCellValue({index,prop,isAdd=false,isActual=true}){
            const row=isActual?this.getRowValue(index,isAdd):this._getRow(index,isAdd);
            return row&&row[prop];
        },
        /*
    	 * 获取行数据
         * @index    第几行
         * @isAdd    是否属于新增行
    	 */
        getRowValue(index,isAdd){
            const row=this._getRow(index,isAdd);
            if(row){
                if(row.editabled){
                    const cells=this.getRowCellComponent(index,isAdd);
                    let newRow={};
                    Object.keys(cells).forEach(key=>{
                        const cell=cells[key];
                        const col=cell.col;
                        const info=cell.component.getValue();
                        newRow[col.prop]=info.value;
                        if(col.propCode){
                            newRow[col.propCode]=info.code;
                        };
                        if(col.propTitle){
                            newRow[col.propTitle]=info.title;
                        };
                        if(!col.unProp&&!newRow[col.prop].hasOwnProperty(col.prop)){
                            if(isFunction(col.dependCompile)){
                                newRow={
                                    ...newRow,
                                    ...col.dependCompile('value',index,newRow[col.prop],col,newRow)
                                };
                                if(col.type=='cascader'){
                                    newRow={
                                        ...newRow,
                                        ...col.dependCompile('title',index,newRow[col.propTitle],col,newRow)
                                    };
                                };
                            }else{
                                if(col.depend){
                                    this._setDependVal(newRow,col,'depend',col.prop);
                                };
                                if(col.dependTitle){
                                    this._setDependVal(newRow,col,'dependTitle',col.propTitle);
                                };
                            };
                        };
                        if(isArray(newRow[col.prop])&&col.type!='upload'){
                            newRow[col.prop]=newRow[col.prop].join(col.multipleSeparate);
                            if(newRow[col.prop]==new Array(newRow[col.prop].length).join(col.multipleSeparate)){
                                newRow[col.prop]='';
                            };
                        };
                        if(isArray(newRow[col.propTitle])){
                            newRow[col.propTitle]=newRow[col.propTitle].join(col.multipleSeparate);
                            if(newRow[col.propTitle]==new Array(newRow[col.propTitle].length).join(col.multipleSeparate)){
                                newRow[col.propTitle]='';
                            };
                        };
                    });
                    return newRow;
                }else{
                    return row;
                };
            };
            return null;
        },
        /*
    	 * 获取新增选中行
    	 */
        getCheckedAddRows(){
            return this._Object2Array(this._filterCheckedAddRows());
        },
        /*
    	 * 获取选中编辑行[包含新增行]
    	 */
        getCheckedEditRows(){
            return this._Object2Array(this._filterCheckedEditRows());
        },
        /*
    	 * 获取编辑行[包含新增行]
    	 */
        getEditRows(){
            return this._Object2Array(this._filterEditRows());
        },
        /*
    	 * 获取新增行
    	 */
        getAddRows(){
            return this._Object2Array(this._filterAddRows());
        },
        /*
    	 * 获取选中非新增行
    	 */
        getCheckedDisAddRows(){
            const rows=this._Object2Array(this._filterCheckedDisAddRows());
            return this._mergeCheckTotalRows(rows);
        },
        /*
    	 * 获取选中行
    	 */
        getCheckedRows(){
            let rows=this._Object2Array(this._filterCheckedRows());
            return this._mergeCheckTotalRows(rows);
        },
        /*
    	 * 获取全部行[不包括新增]
    	 */
        getAllDisAddRows(){
            return this._Object2Array(this._filterAllDisAddRows());
        },
        /*
         * 获取全部行
         */
        getAllRows(){
            return this._Object2Array(this._filterAllRows());
        },
        /*
    	 * 取消选中行
         * @index    第几行
         * @isAdd    是否属于新增行
    	 */
        cancelCheckedRow(index,isAdd=false){
            const row=this._getRow(index,isAdd);
            if(row&&row.checked&&!row.disabled){
                this._fetchCheckRow(this._getIndex(index,isAdd),false);
            };
        },
        /*
    	 * 设置选中行
         * @index    第几行
         * @isAdd    是否属于新增行
    	 */
        setCheckedRow(index,isAdd=false){
            const row=this._getRow(index,isAdd);
            if(row&&!row.checked&&!row.disabled){
                this._fetchCheckRow(this._getIndex(index,isAdd),true);
            };
        },
        /*
    	 * 取消全选
    	 */
        cancelCheckedRows(){
            if(this.checkType=='checkbox'){
                this.adds.forEach((row,index)=>{
                    if(!row.disabled){
                        this.cancelCheckedRow(index,true);
                    };
                });
                this.list.forEach((row,index)=>{
                    if(!row.disabled){
                        this.cancelCheckedRow(index);
                    };
                });
            };
        },
        /*
    	 * 全选
    	 */
        setCheckedRows(){
            if(this.checkType=='checkbox'){
                this.adds.forEach((row,index)=>{
                    if(!row.disabled){
                        this.setCheckedRow(index,true);
                    };
                });
                this.list.forEach((row,index)=>{
                    if(!row.disabled){
                        this.setCheckedRow(index);
                    };
                });
            };
        },
        /*
    	 * 取消全部编辑行
    	 */
        resetEditRows(){
            this.list.forEach((row,index)=>{
                this.resetEditRow(index);
            });
        },
        /*
    	 * 还原编辑行
         * @index    第几行
    	 */
        resetEditRow(index){
            const row=this.list[index];
            if(row&&row.editabled){
                this.resetRow(index);
                this.setCellState({
                    index:index,
                    status:false
                });
            };
        },
        /*
    	 * 编辑行
         * @index    第几行
    	 */
        enabledEditRow(index){
            const row=this.list[index];
            if(row&&!row.editabled&&!row.disabled){
                this.setCellState({
                    index:index,
                    status:true
                });
            };
        },
        /*
    	 * 重置全部行
    	 */
        resetRows(){
            this.adds.forEach((row,index)=>{
                this.resetRow(index,true);
            });
            this.list.forEach((row,index)=>{
                this.resetRow(index,false);
            });
        },
        /*
    	 * 重置行
         * @index    第几行
         * @isAdd    是否属于新增行
    	 */
        resetRow(index,isAdd){
            const row=this._getRow(index,isAdd);
            if(row&&row.editabled){
                const cells=this.getRowCellComponent(index,isAdd);
                Object.keys(cells).map(key=>{
                    const cell=cells[key].component;
                    cell.reset&&cell.reset();
                });
            };
        },
        /*
    	 * 校验多行
         * @rows          需要校验的全部行,格式为{adds:{},list:{}}
         * @isScrollTo    是否校验失败自动定位到失败dom
    	 */
        async fetchVaildRows(rows,isScrollTo=true){
            let flag=true;
            flag=flag&&this.fetchVaildAddRows(rows.adds||{},isScrollTo);
            for(let i in rows.list||{}){
                const _flag=await this.fetchVaildRow(i,false,isScrollTo&&flag);
                flag=flag&&_flag;
            };
            // Object.keys(rows.list||{}).forEach(i=>{
            //
            // });
            return flag;
        },
        /*
    	 * 校验全部新增行
         * @rows          需要校验的全部行,格式为{adds:{},list:{}}
         * @isScrollTo    是否校验失败自动定位到失败dom
    	 */
        async fetchVaildAddRows(rows,isScrollTo=true){
            let flag=true;
            rows=rows||this._filterAddRows().adds||{};
            for(let i in rows){
                let _flag=await this.fetchVaildRow(i,true,isScrollTo&&flag);
                flag=flag&&_flag;
            };
            return flag;
        },
        /*
    	 * 校验单行
         * @index         第几行
         * @isScrollTo    是否校验失败自动定位到失败dom
    	 */
        async fetchVaildRow(index,isAdd,isScrollTo=true){
            let flag=true,isPos=false;
            const cells=this.getRowCellComponent(index,isAdd);
            for(let key in cells){
                const cell=cells[key].component;
                const _flag=await cell.fetchValid();
                flag=flag&&_flag;
                if(!_flag&&isScrollTo&&!isPos){
                    isPos=true;
                    const rect=cell.$el.getBoundingClientRect();
                    const body_center_scroll=this.$refs.body_center_scroll;
                    const body_center_rect=body_center_scroll.$el.getBoundingClientRect();
                    this._resetScrollLeft(rect.left-body_center_rect.left+body_center_scroll.wrap.scrollLeft-5);
                    this._resetScrollTop(rect.top-body_center_rect.top+body_center_scroll.wrap.scrollTop-35);
                };
            };
            return flag;
        },
        /*
    	 * 刷新
         * @page         第几页
    	 */
        refresh(page){
            page=Math.max(1,Math.min(page||this.currentPage,Math.ceil(this.total/this.pageSize)));
            this.deleteAddRows();
            this.cancelCheckedRows();
            this.resetEditRows();
            this._resetScrollLeft();
            this._resetScrollTop();
            this.getPageInfo(page);
        }
    }
};
