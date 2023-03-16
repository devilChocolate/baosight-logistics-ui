/*
 * grid main混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import { isPlainObject, isFunction } from "@/utils/tool";

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      adds: [],
      historyChecks: {},
      cellState: [],
      _dataSource: [],
      sortParam: {},
    };
  },
  props: {},
  watch: {
    /*
     * 监听分页
     */
    pageLimit: {
      handler(val) {
        this.pageSize = val;
      },
      immediate: true,
    },
    /*
     * 监听单元格
     */
    cellState: {
      handler(val) {
        val.forEach((col, i) => {
          let flag = true;
          for (let key in col) {
            if (col[key]) {
              flag = false;
              break;
            }
          }
          if (this.list[i]) {
            this.list[i].editabled = !flag;
          }
        });
      },
      deep: true,
      immediate: true,
    },
    /*
     * 监听非编辑行
     */
    list: {
      handler(val) {
        val.forEach((row) => {
          this.saveHistoryCheckRow(row);
        });
      },
      deep: true,
    },
  },
  created() {
    if (this.dataSource) {
      this._dataSource = JSON.parse(JSON.stringify(this.dataSource));
    }
    //console.log('this.dataSource',this.dataSource)
  },
  methods: {
    /*
     * 设置行排序
     */
    setSortRows(flag) {
      if (!this.sortAxiosEnabled && Object.keys(this.sortParam).length) {
        const prop = Object.keys(this.sortParam)[0];
        const list = JSON.parse(JSON.stringify(this.list)).sort((a, b) => {
          let _prop =
            this.sourceCol[prop].propTitle || this.sourceCol[prop].prop;
          if (this.sortParam[prop] == "desc") {
            return a[_prop] >= b[_prop] ? -1 : 1;
          } else if (this.sortParam[prop] == "asc") {
            return a[_prop] <= b[_prop] ? -1 : 1;
          }
          return null;
        });
        if (flag) {
          this.list = list;
        } else {
          this.list = this.list.map((row, index) => {
            if (row.editabled) {
              this.resetRow(index);
            }
            this.setCellState({
              index: index,
              status: list[index].editabled,
            });
            return list[index];
          });
          this.$nextTick(() => {
            this.list.forEach((row, index) => {
              if (row.editabled) {
                this.setRowValue(index, row);
              }
            });
            this.$nextTick(() => {
              this.refreshTableBodyRowsHeight("setSortRows");
            });
          });
        }
      }
    },
    /*
     * 获取分页内容数据
     */
    getPageInfo(page) {
      this.currentPage = page;
      this.showLoading();
      this.clickRowIndex = null;
      this.getListInfo().then(({ result, msg }) => {
        this.list.splice(
          0,
          this.list.length,
          ...result.data.slice(0, this.pageSize)
        );
        this.list = this.formatList(this.list);
        this.setSortRows(true);
        //console.log('this.list',this.list);
        this.cellState = this.getCellState();
        //console.log('this.cellState',this.cellState);
        this.total = result?.total || 0;
        if (this.list.length) {
          this.$nextTick(() => {
            if (this.isCheckAll && this.checkType == "checkbox") {
              this.list.forEach((row, index) => {
                if (row && !row.checked) {
                  this._fetchCheckRow(this._getIndex(index), true);
                }
              });
            }
            this.refreshTableBodyRowsHeight("getPageInfo");
            this.showContent();
          });
        } else {
          if (!this.total) {
            if (!this.$slots.empty) {
              this.showResult(msg || this.emptyMessage);
            } else {
              msg ? this.showResult(msg) : this.showContent();
            }
          } else {
            this.showResult(msg || this.emptyMessage);
          }
        }
        if (!this.isLoaded) {
          this.isLoaded = true;
          this.$nextTick(() => {
            this.$emit("bsx-grid-init", result);
            this.$emit("bsx-grid-check-change", {
              rows: this.getCheckedDisAddRows(),
            });
            if (this.isChildGrid && this._parentGrid) {
              this._parentGrid.refreshTableBodyRowsHeight("childGrid");
            }
          });
        }
      });
    },
    /*
     * 获取请求参数
     */
    getAxiosParam() {
      let o = {};
      if (this.sortAxiosEnabled) {
        o.sort = {};
        Object.keys(this.sortParam).forEach((prop) => {
          if (this.sortParam[prop]) {
            o.sort[prop] = this.sortParam[prop];
          }
        });
        if (!Object.keys(o.sort).length) {
          delete o.sort;
        }
      }
      o = Object.assign(
        o,
        isFunction(this.axiosMap)
          ? this.axiosMap("send", this.axiosParam, this.getAxiosIndex.read)
          : this.axiosParam
      );
      return o;
    },
    /*
     * 获取列表数据
     */
    getListInfo() {
      return new Promise((resolve, reject) => {
        if (this.dataSource) {
          resolve({
            result: {
              total: this._dataSource.length,
              data: JSON.parse(JSON.stringify(this._dataSource)).slice(
                (this.currentPage - 1) * this.pageSize,
                this.currentPage * this.pageSize
              ),
            },
          });
        } else {
          this.$http({
            method: this.axiosType,
            url: isPlainObject(this.axiosUrl)
              ? this.axiosUrl.read
              : this.axiosUrl,
            data: {
              ...this.getAxiosParam(),
              offset: this.currentPage,
              limit: this.pageSize,
            },
            noLoading: true,
          })
            .then((res) => {
              if (isFunction(this.axiosMap)) {
                res = this.axiosMap("response", res, this.getAxiosIndex.read);
              }
              resolve({
                result: res,
              });
            })
            .catch(({ msg }) => {
              resolve({
                result: {
                  total: this.total,
                  data: [],
                },
                msg: msg,
              });
            });
        }
      });
    },
    /*
     * 格式化总数据
     */
    formatList(data) {
      return data.map((item, index) => {
        item.disabled = this.isDisabled;
        item.editabled = false;
        item.checked = this.historyCheckFilterId
          ? !!this.historyChecks[this._getRowFilterId(item)]
          : false;
        item.addabled = false;
        item.showabled = true;
        item.expanding = false;
        item.expand = false;
        item.children = null;
        if (isFunction(this.customRowData)) {
          item = Object.assign(item, this.customRowData(item, index));
        }
        if (this.checkType) {
          item[this.checkType] = item.checked;
        }
        this._mergeDependRowData(item, index);
        return item;
      });
    },
    /*
     * 获取单元格状态
     */
    getCellState() {
      return this.list.map((row, i) => {
        let o = {};
        Object.keys(this.sourceCol).map((key) => {
          o[key] = false;
        });
        return o;
      });
    },
    /*
     * 设置单元格状态
     * @key  key不存在则设置整行
     */
    setCellState({ index, key, status }) {
      let flag = false;
      for (let i = 0; i < this.cellState.length; i++) {
        if (i == index) {
          let cell = this.cellState[i];
          if (cell.hasOwnProperty(key)) {
            cell[key] = status;
          } else {
            Object.keys(cell).map((j) => {
              cell[j] = status;
            });
          }
          flag = true;
          break;
        }
      }
      flag &&
        this.$nextTick(() => {
          this.refreshTableBodyRowsHeight("setCellState");
        });
    },
    /*
     * 保存历史选中
     */
    saveHistoryCheckRow(row) {
      if (this.checkType == "checkbox" && this.historyCheckFilterId) {
        const id = this._getRowFilterId(row);
        if (row.checked) {
          if (!this.historyChecks[id]) {
            this.historyChecks[id] = row;
          }
        } else {
          delete this.historyChecks[id];
        }
      }
    },
  },
};
