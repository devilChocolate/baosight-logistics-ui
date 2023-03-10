/*
 * grid base混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
  isPlainObject,
  isFunction,
  isArray,
} from "@utils/tool";

export default {
  methods: {
    /*
     * 创建一条新增行空数据
     */
    _creatAddRowEmptyData() {
      let row = {
        addabled: true,
        editabled: true,
        showabled: true,
        checked: false,
        expanding: false,
        expand: false,
        disabled: false,
        children: null,
      };
      Object.keys(this.sourceCol).map((key) => {
        let col = this.sourceCol[key];
        if (col.prop && !col.unProp) {
          row[col.prop] = "";
        }
      });
      if (this.checkType) {
        row[this.checkType] = row.checked;
      }
      this._mergeDependRowData(row);
      return row;
    },
    /*
     * 隐藏弹出组件
     */
    hideCellPopper() {
      this._handleHidePopper(this.list);
      this._handleHidePopper(this.adds, true);
      if (this.showHeader) {
        Object.keys(this.sourceCol).map((key) => {
          const col = this.sourceCol[key];
          if (col.toolEnabled) {
            const column = this.$refs[`head_column_${key}`];
            if (column) {
              const filter = column.$refs.popover;
              if (filter) {
                filter.doClose();
              }
            }
          }
        });
      }
      this._handleHideChildPopper();
    },
    /*
     * 头部工具栏保存
     */
    _handleHideChildPopper() {
      const expandComponent = this.getExpandChildComponent();
      if (expandComponent) {
        expandComponent.forEach((item) => {
          if (isFunction(item._getGridComponent)) {
            const expandGrid = item._getGridComponent();
            expandGrid && expandGrid.hideCellPopper();
          }
        });
      }
    },
    /*
     * 辅助隐藏弹出组件
     */
    _handleHidePopper(rows, isAdd) {
      if (rows.length) {
        rows.forEach((row, i) => {
          const cells = this.getRowCellComponent(i, isAdd);
          Object.keys(cells).map((key) => {
            const cell = cells[key].component;
            cell.$refs.cell && cell.hidePopper && cell.hidePopper();
          });
        });
      }
    },
    /*
     * 设置折叠子组件
     */
    setExpandChildComponent(index) {
      const expandComponent = this.getExpandChildComponent(index);
      const expandGrid = this.getExpandChildGrid(index);
      if (expandComponent) {
        expandComponent._parentGrid = this;
      }
      if (expandGrid) {
        expandGrid._parentGrid = this;
        expandGrid._expandChildIndex = expandComponent.expandChildIndex;
      } else {
        this.refreshTableBodyRowsHeight("handleRowExpand");
      }
    },
    /*
     * 获取折叠子grid
     */
    getExpandChildGrid(index) {
      const expandComponent = this.getExpandChildComponent(index);
      if (expandComponent) {
        if (index != undefined) {
          if (isFunction(expandComponent._getGridComponent)) {
            return expandComponent._getGridComponent();
          }
          return null;
        } else {
          const expandGrid = expandComponent
            .map((item) => {
              if (isFunction(item._getGridComponent)) {
                return item._getGridComponent();
              }
            })
            .filter((item) => {
              return !!item;
            });
          return expandGrid.length ? expandGrid : null;
        }
      }
    },
    /*
     * 获取折叠子组件
     */
    getExpandChildComponent(index) {
      if (this.$refs.body_center_table) {
        const children = this.$refs.body_center_table.$children;
        if (children && children.length) {
          const expandComponent = children.filter((item) => {
            return item.$options.propsData.hasOwnProperty("expandChildIndex");
          });
          if (index != undefined) {
            return expandComponent.filter((item) => {
              return item.$options.propsData.expandChildIndex === index;
            })[0];
          } else {
            return expandComponent;
          }
        }
      }
    },
    /*
     * 获取第index行对应组件
     */
    getRowCellComponent(index, isAdd = false) {
      let cells = {};
      Object.keys(this.sourceCol).map((key) => {
        let cell = this.$refs[`${key}-${isAdd}-${index}`];
        if (cell) {
          cell = cell.$children && cell.$children[0];
          if (
            cell &&
            (cell = cell.$refs && cell.$refs.formItem) &&
            cell.fetchValid
          ) {
            cells[key] = {
              col: this.sourceCol[key],
              component: cell,
            };
          }
        }
      });
      return cells;
    },
    /*
     * 辅助删除非新增行
     */
    _fetchDeleteDisAddRows(rows) {
      return new Promise((resolve, reject) => {
        this.showConfirm({
          content: "确定要删除吗？",
          sure: ({ node, close }) => {
            this.asyncAxiosSend(
              "delete",
              {
                rows: JSON.stringify(rows),
                ...this.axiosParam,
              },
              node
            ).then((res) => {
              close();
              this.showToast({
                content: "删除成功！",
                status: true,
                target: this.$el,
              });
              resolve();
            });
          },
        });
      });
    },
    /*
     * 辅助手动保存行
     */
    _handleSaveRows(rows) {
      return new Promise((resolve, reject) => {
        if (!this._hasRows(rows)) {
          this.showMessages("请至少选中1行");
        } else {
          this._fetchSaveRows(rows).then(() => {
            resolve();
          });
        }
      });
    },
    /*
     * 辅助保存行
     */
    _fetchSaveRows(rows) {
      return new Promise(async (resolve, reject) => {
        if (this._hasRows(rows)) {
          const flag = await this.fetchVaildRows(rows);
          let newRows = {
            adds: {},
            list: {},
          };
          if (flag) {
            Object.keys(rows.adds || {}).forEach((index) => {
              newRows.adds[index] = {
                ...rows.adds[index],
                ...this.getRowValue(index, true),
              };
            });
            Object.keys(rows.list || {}).forEach((index) => {
              newRows.list[index] = {
                ...rows.list[index],
                ...this.getRowValue(index),
              };
            });
            this.asyncAxiosSend("update", {
              rows: JSON.stringify(this._Object2Array(newRows)),
              ...this.axiosParam,
            }).then((res) => {
              this._updateRowsData(newRows).then((flag) => {
                this.refresh();
              });
              this.showToast({
                content: "更新成功！",
                status: true,
                target: this.$el,
              });
              resolve();
            });
          }
        }
      });
    },
    /*
     * 辅助更新行数据
     */
    _updateRowsData(rows) {
      return new Promise((resolve, reject) => {
        const flag = !!Object.keys(rows.adds || {}).length;
        Object.keys(rows.list || {}).forEach((index) => {
          let row = rows.list[index];
          this.update(index, row, {
            editabled: false,
            checked: false,
          });
          this.setCellState({
            index: index,
            status: false,
          });
          this.$nextTick(() => {
            this.setRowValue(index, {
              ...row,
              ...{
                editabled: false,
              },
            });
            this.$nextTick(() => {
              this.cancelCheckedRow(index);
            });
          });
        });
        if (flag && this.dataSource) {
          this._dataSource.splice(
            this.pageSize * (this.currentPage - 1),
            0,
            ...Object.keys(rows.adds || {}).map((index) => {
              return {
                ...rows.adds[index],
                editabled: false,
                checked: false,
                addabled: false,
                showabled: true,
                expanding: false,
                expand: false,
                children: null,
              };
            })
          );
          this.total = this._dataSource.length;
          this.deleteAddRows();
        }
        resolve(flag);
      });
    },
    /*
     * 辅助删除行数据
     */
    _removeRowsData(rows) {
      Object.keys(rows || {}).forEach((index, i) => {
        this.list.splice(Number(index) - i, 1);
        if (this.dataSource) {
          this._dataSource.splice(
            this.pageSize * (this.currentPage - 1) + Number(index) - i,
            1
          );
          this.total = this._dataSource.length;
        }
        const id = this._getRowFilterId(rows[index]);
        delete this.historyChecks[id];
      });
    },
    /*
     * 删除历史选中行
     */
    _removeHistoryCheckRows(rows) {
      if (rows && rows.length) {
        rows.forEach((row) => {
          const id = this._getRowFilterId(row);
          delete this.historyChecks[id];
          if (this.dataSource) {
            for (let i = 0; i < this._dataSource.length; i++) {
              const _id = this._getRowFilterId(this._dataSource[i]);
              if (id != _id) {
                this._dataSource.splice(i, 1);
                break;
              }
            }
            this.total = this._dataSource.length;
          }
        });
      }
    },
    /*
     * 重置滚动到左侧顶点
     */
    _resetScrollLeft(left = 0) {
      const body_center_scroll = this.$refs.body_center_scroll;
      body_center_scroll &&
        body_center_scroll.scrollTo({
          left: left,
        });
      !this.isBorder && this._getScrollState(left, false);
    },
    /*
     * 重置滚动到顶部顶点
     */
    _resetScrollTop(top = 0) {
      const body_center_scroll = this.$refs.body_center_scroll;
      body_center_scroll &&
        body_center_scroll.scrollTo({
          top: top,
        });
    },
    /*
     * 辅助选中行
     */
    _fetchCheckRow(index, flag) {
      let list = this.adds.concat(this.list);
      if (list[index] && this.checkType) {
        if (this.checkType == "radio") {
          list = list.map((row, i) => {
            row.checked = flag ? index == i : flag;
            row[this.checkType] = row.checked;
            return row;
          });
        } else if (this.checkType == "checkbox") {
          list[index].checked = flag;
          list[index][this.checkType] = list[index].checked;
        }
      }
      if (this.adds.length) {
        if (index < this.adds.length) {
          this.adds.splice(index, 1, list[index]);
        } else {
          this.list.splice(index - this.adds.length, 1, list[index]);
        }
      } else {
        this.list.splice(index, 1, list[index]);
      }
    },
    /*
     * 辅助获取新增选中行对象
     */
    _filterCheckedAddRows() {
      return this._fetchFilterRows((row) => {
        return row.checked && row.addabled;
      });
    },
    /*
     * 辅助获取选中编辑行[包含新增行]对象
     */
    _filterCheckedEditRows() {
      return this._fetchFilterRows((row) => {
        return row.checked && row.editabled;
      });
    },
    /*
     * 辅助获取编辑行[包含新增行]对象
     */
    _filterEditRows() {
      return this._fetchFilterRows((row) => {
        return row.editabled;
      });
    },
    /*
     * 辅助获取新增行对象
     */
    _filterAddRows() {
      return this._fetchFilterRows((row) => {
        return row.addabled;
      });
    },
    /*
     * 辅助获取选中非新增行对象
     */
    _filterCheckedDisAddRows() {
      return this._fetchFilterRows((row) => {
        return row.checked && !row.addabled;
      });
    },
    /*
     * 辅助获取选中行[包含新增行]对象
     */
    _filterCheckedRows() {
      return this._fetchFilterRows((row) => {
        return row.checked;
      });
    },
    /*
     * 辅助获取全部行[不包含新增行]对象
     */
    _filterAllDisAddRows() {
      return this._fetchFilterRows((row) => {
        return !row.addabled;
      });
    },
    /*
     * 辅助获取全部行[包含新增行]对象
     */
    _filterAllRows() {
      return this._fetchFilterRows((row) => {
        return true;
      });
    },
    /*
     * 获取筛选行
     */
    _fetchFilterRows(filter) {
      let o = {
        adds: {},
        list: {},
      };
      for (let i = 0; i < this.adds.length; i++) {
        if (filter(this.adds[i])) {
          o.adds[i] = this.adds[i];
        }
      }
      for (let i = 0; i < this.list.length; i++) {
        if (filter(this.list[i])) {
          o.list[i] = this.list[i];
        }
      }
      return o;
    },
    /*
     * 获取筛选行数据
     */
    _fetchFilterRowsValue(rows) {
      let res = [];
      Object.keys(rows.adds || {}).forEach((index) => {
        res.push(this.getRowValue(index, true));
      });
      Object.keys(rows.list || {}).forEach((index) => {
        res.push(this.getRowValue(index));
      });
      return res;
    },
    /*
     * 辅助删除新增选定的行
     */
    _handleDeleteAddRows(rows) {
      const oRows = this.getAddRowsValue().filter((row, i) => {
        return !!!rows[i];
      });
      Object.keys(rows || {}).forEach((index, i) => {
        this.adds.splice(Number(index) - i, 1);
      });
      this.$nextTick(() => {
        oRows.forEach((row, i) => {
          this.setRowValue(i, row, true);
        });
      });
    },
    /*
     * 是否存在行
     */
    _hasRows(rows) {
      if (rows) {
        const adds = rows.adds || {};
        const list = rows.list || {};
        return !!Object.keys(adds).length || !!Object.keys(list).length;
      }
      return false;
    },
    /*
     * 对象转数组
     */
    _Object2Array(o) {
      let arr = [];
      Object.keys(o).forEach((type) => {
        Object.keys(o[type]).forEach((key) => {
          arr.push(o[type][key]);
        });
      });
      return arr;
    },
    /*
     * 合并depend数据
     */
    _mergeDependRowData(row, index = 0) {
      Object.keys(this.sourceCol).map((key) => {
        let col = this.sourceCol[key];
        if (
          col.prop &&
          col.prop != this.checkType &&
          !row.hasOwnProperty(col.prop) &&
          !col.unProp
        ) {
          if (isFunction(col.depend)) {
            row[col.prop] = col.depend("value", index, col, row);
            if (col.type == "cascader") {
              row[col.propTitle] = col.depend("title", index, col, row);
            }
          } else {
            if (col.depend) {
              this._getDependVal(row, col, "depend", col.prop);
            }
            if (col.dependTitle) {
              this._getDependVal(row, col, "dependTitle", col.propTitle);
            }
          }
          if (
            row[col.prop] &&
            row[col.prop] ==
              new Array(row[col.prop].split(col.multipleSeparate).length).join(
                col.multipleSeparate
              )
          ) {
            row[col.prop] = "";
          }
          if (
            col.propTitle &&
            row[col.propTitle] &&
            row[col.propTitle] ==
              new Array(
                row[col.propTitle].split(col.multipleSeparate).length
              ).join(col.multipleSeparate)
          ) {
            row[col.propTitle] = "";
          }
        }
      });
      return row;
    },
    /*
     * 获取depend数据
     */
    _getDependVal(row, col, type, prop) {
      const depend = isArray(col[type]) ? col[type] : col[type].split(",");
      row[prop] = depend
        .map((key) => {
          return row[key] == undefined ? "" : row[key];
        })
        .join(col.multipleSeparate);
    },
    /*
     * 设置depend数据
     */
    _setDependVal(row, col, type, prop) {
      const dependVal = isArray(row[prop])
        ? row[prop]
        : row[prop].split(col.multiple);
      const depend = isArray(col[type]) ? col[type] : col[type].split(",");
      depend.map((key, i) => {
        row[key] = dependVal[i] == undefined ? "" : dependVal[i];
      });
    },
    /*
     * 合并历史选中行
     */
    _mergeCheckTotalRows(rows) {
      let ids = {},
        newRows = [];
      rows.forEach((row) => {
        let id = this._getRowFilterId(row);
        ids[id] = true;
      });
      Object.keys(this.historyChecks).map((id) => {
        if (!ids[id]) {
          newRows.push(this.historyChecks[id]);
        }
      });
      return [...newRows, ...rows];
    },
    /*
     * 获取指定行
     */
    _getRow(index, isAdd = false) {
      return (isAdd ? this.adds : this.list)[index];
    },
    /*
     * 获取索引值
     */
    _getIndex(index, isAdd = false) {
      return Number(index) + (isAdd ? 0 : this.adds.length);
    },
    /*
     * 发送请求
     */
    asyncAxiosSend(type, param, node) {
      return new Promise((resolve, reject) => {
        if (this.dataSource) {
          resolve();
        } else {
          const loading = this.$$loading({
            target: node || this.$el,
            size: 35,
          });
          this.$http({
            method: this.axiosType,
            url: isPlainObject(this.axiosUrl)
              ? this.axiosUrl[type]
              : this.axiosUrl,
            data: isFunction(this.axiosMap)
              ? this.axiosMap("send", param, this.getAxiosIndex[type])
              : param,
            noLoading: true,
          })
            .then((res) => {
              res = res.data;
              loading && loading.close();
              if (isFunction(this.axiosMap)) {
                res = this.axiosMap("response", res, this.getAxiosIndex[type]);
              }
              resolve(res);
            })
            .catch(({ msg }) => {
              loading && loading.close();
              this.showMessages(msg);
            });
        }
      });
    },
    /*
     * 辅助切换分页截取器
     */
    _fetchPageIntercept({ page, size }, fn) {
      if (isFunction(this.pageIntercept)) {
        const isPageFlag = page != this.currentPage;
        const isSizeFlag = size != this.pageSize;
        if (isPageFlag || isSizeFlag) {
          if (isPageFlag) {
            this.$refs.pagination.$children[5].handleChange(this.currentPage);
          }
          if (isSizeFlag) {
            this.$refs.pagination.internalPageSize = this.pageSize;
          }
          this.pageIntercept(fn);
        }
      } else {
        fn();
      }
    },
    /*
     * 获取行唯一id
     */
    _getRowFilterId(row) {
      return isFunction(this.historyCheckFilterId)
        ? this.historyCheckFilterId(row)
        : row[this.historyCheckFilterId];
    },
  },
};
