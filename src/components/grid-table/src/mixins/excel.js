/*
 * 导出excel-混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import { export_json_to_excel } from "@utils/excel.js";
import { isPlainObject, isFunction, createRandomUid } from "@utils/tool.js";

export default {
  methods: {
    /*
     * 导出全部页
     */
    exportAllPage2Excel() {
      if (this.dataSource) {
        this.export2Excel(
          this._dataSource.map((row, index) => {
            return this._mergeDependRowData(row, index);
          })
        );
      } else {
        const loading = this.$$loading({
          target: this.$refs.body,
          size: 35,
        });
        this.$http({
          method: this.axiosType,
          url: isPlainObject(this.axiosUrl)
            ? this.axiosUrl.read
            : this.axiosUrl,
          data: {
            ...this.getAxiosParam(),
            offset: 1,
            limit: 99999999,
          },
          noLoading: true,
        })
          .then((res) => {
            res = res.data;
            loading && loading.close();
            if (isFunction(this.axiosMap)) {
              res = this.axiosMap("response", res, this.getAxiosIndex.read);
            }
            this.export2Excel(
              res.list.map((row, index) => {
                return this._mergeDependRowData(row, index);
              })
            );
          })
          .catch(({ msg }) => {
            loading && loading.close();
            this.showMessages(msg);
          });
      }
    },
    /*
     * 导出当前页
     */
    exportCurrentPage2Excel() {
      this.export2Excel(this.getAllDisAddRows());
    },
    /*
     * 导出选中行
     */
    exportCheckedRowsExcel() {
      const rows = this.getCheckedDisAddRows();
      if (rows.length) {
        this.export2Excel(rows);
      } else {
        this.showMessages("请至少选中1行");
      }
    },
    /*
     * 导出excel
     */
    export2Excel(rows) {
      const cols = Object.keys(this.sourceCol)
        .map((key) => {
          return this.sourceCol[key];
        })
        .filter((col) => {
          return (
            col.prop &&
            !col.unProp &&
            col.exportable &&
            col.type != "upload" &&
            col.type != "custom"
          );
        });
      let tHeader = cols.map((col) => {
        return col.label;
      });
      if (this.showIndex) {
        tHeader.unshift("序号");
      }
      rows = rows.map((row, index) => {
        let _row = cols.map((col) => {
          let value = (value = col.propTitle
            ? row[col.propTitle]
            : row[col.prop]);
          if (col.type == "calendar") {
            value = value
              .split(col.multipleSeparate)
              .map((date) => {
                return this.formatText(date);
              })
              .join("至");
          } else if (col.type == "cascader") {
            if (col.showAllLevels) {
              value = value
                .split(col.multipleSeparate)
                .map((date) => {
                  return this.formatText(date);
                })
                .join(col.multipleSeparate);
            } else {
              const val = value.split(col.multipleSeparate);
              value = val[val.length - 1];
            }
          }
          return this.formatText(value);
        });
        if (this.showIndex) {
          _row.unshift(`${index + 1}`);
        }
        return _row;
      });
      export_json_to_excel({
        header: tHeader,
        data: rows,
        filename:
          this.exportExcelFileName ||
          `grid-${this.formatDate(new Date(), "YYYY-MM-DD hh:mm:ss").replace(
            /(\s+)|-|:/gm,
            ""
          )}-${createRandomUid()}`,
      });
    },
  },
  components: {},
  beforeDestroy() {},
};
