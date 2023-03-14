<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
  <table class="app_grid-table" width="100%" cellspacing="0" cellpadding="0" border="0">
    <thead v-if="type=='head'">
      <tr>
        <template v-for="(col,i) in cols">
          <th
            v-if="col.visible"
            :key="`${type}-head-${locked}-${i}`"
            class="app_grid-table-th"
            :class="{highter:col.highlightable,expand:col.isExpand&&checkType=='radio'}"
            :align="col.align"
            :width="col.width"
          >
            <slot name="header" :col="col" />
          </th>
        </template>
      </tr>
    </thead>
    <tbody v-else-if="type=='body'">
      <template v-if="adds&&adds.length">
        <tr
          v-for="(row,j) in adds"
          :key="`${type}-true-${locked}-${j}`"
          :class="{disabled:row.disabled&&checkType,isAdd:true,child:isChild}"
          @mouseenter="handleMouseEnterRows(j,true)"
          @mouseleave="handleMouseLeaveRows(j,true)"
        >
          <template v-for="(col,i) in cols">
            <td
              v-if="col.visible"
              :key="`${type}-add-${locked}-${j}-${i}`"
              class="app_grid-table-td"
              :class="{highter:col.highlightable,expand:col.isExpand}"
              :align="col.align"
              :width="col.width"
            >
              <div v-if="col.isIndex" class="bsx-form-cell">{{ getIndexValue(j,false,true) }}</div>
              <slot
                v-else-if="!col.isExpand"
                name="adds"
                :row="row"
                :col="col"
                :value="row[col.prop]"
                :code="row[col.propCode]"
                :index="j"
              />
            </td>
          </template>
        </tr>
      </template>
      <template v-for="(row,j) in totalRows">
        <tr
          v-show="!(row.hasOwnProperty('showabled')&&!row.showabled)"
          :key="`${type}-false-${locked}-${j}`"
          :class="{even:j<rows.length&&getStripeFlag(j,row),disabled:row.disabled&&checkType,checked:clickRowIndex==j,child:isChild,redRow:row.red,blueRow:row.blue}"
          @click="handleClickRows(j)"
          @mouseenter="handleMouseEnterRows(j)"
          @mouseleave="handleMouseLeaveRows(j)"
        >
          <template v-for="(col,i) in cols">
            <td
              v-if="col.visible"
              :key="`${type}-${locked}-${j}-${i}`"
              class="app_grid-table-td"
              :class="{borT:getSumFlag&&getBorderFlag(j),fontB:getSumFlag&&j>=rows.length,highter:col.highlightable,expand:col.isExpand}"
              :align="col.align"
              :width="col.width"
            >
              <div v-if="col.isIndex" class="app_grid-cell">
                <template v-if="j<rows.length">{{ getIndexValue(j) }}</template>
              </div>
              <div
                v-else-if="col.isExpand&&j<rows.length"
                class="app_grid-cell flex-row align-center app_grid-table-expand-btn"
                @click.stop="handleRowExpand(row,j)"
              >
                <bsx-loading v-if="row.expanding" :target="null" :size="30" box-background="rgba(0,0,0,0)" />
                <i v-else class="icon iconfont icon-jiantou-you-cuxiantiao" :class="{active:row.expand}" />
              </div>
              <slot
                v-else-if="!getSumFlag"
                name="list"
                :row="row"
                :col="col"
                :value="row[col.prop]"
                :code="row[col.propCode]"
                :index="j"
              />
              <template v-else>
                <slot
                  v-if="j<rows.length"
                  name="list"
                  :row="row"
                  :col="col"
                  :value="row[col.prop]"
                  :code="row[col.propCode]"
                  :index="j"
                />
                <template v-else>
                  <slot
                    v-if="getSumSlotFlag(j,col)"
                    name="list"
                    :row="row"
                    :col="col"
                    :value="row[col.prop]"
                    :code="row[col.propCode]"
                    :index="j"
                  />
                  <template v-else-if="sumable&&checkSumable">
                    <span class="text-overflow">
                      <slot v-if="j==totalRows.length-2" name="sum" text="合计" :index="i" />
                      <slot v-if="j==totalRows.length-1" name="sum" text="选中合计" :index="i" />
                    </span>
                  </template>
                  <slot v-else name="sum" :text="sumable?'合计':'选中合计'" :index="i" />
                </template>
              </template>
            </td>
          </template>
        </tr>
        <template v-if="j<rows.length&&row.expand">
          <tr v-show="!(row.hasOwnProperty('showabled')&&!row.showabled)" :key="`${type}-expand-${locked}-${j}`" class="expand">
            <td
              :key="`${type}-expand-${locked}-${j}-1`"
              class="app_grid-table-td colspan-expand"
              :colspan="cols.length"
              align="left"
              width="100%"
              data-expand="true"
            >
              <slot v-if="locked!='left'" name="expand" :index="j" :row="row" />
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  components: {

  },
  mixins: [

  ],
  props: {
    /*
         * 单击行
         */
    clickRowIndex: '',
    /*
         * 是否子表格
         */
    isChild: Boolean,
    /*
         * 是否边框
         */
    isBorder: Boolean,
    /*
         * 新增行
         */
    adds: Array,
    /*
         * 行
         */
    rows: Array,
    /*
         * 所有行
         */
    totalRows: Array,
    /*
         * 列
         */
    cols: Array,
    /*
         * 锁区域
         */
    locked: {
      type: String,
      validator(value) {
        return [
          'left',
          'center',
          'right'
        ].indexOf(value) !== -1
      }
    },
    /*
         * 表头or表身
         */
    type: {
      type: String,
      validator(value) {
        return [
          'head',
          'body'
        ].indexOf(value) !== -1
      }
    },
    /*
    	 * 是否斑马纹
    	 */
    stripe: Boolean,
    /*
    	 * 是否汇总
    	 */
    sumable: Boolean,
    /*
    	 * 是否选中汇总
    	 */
    checkSumable: Boolean,
    /*
    	 * 选中方式
    	 */
    checkType: String,
    /*
    	 * 当前页码
    	 */
    currentPage: Number,
    /*
    	 * 页条数
    	 */
    pageSize: Number
  },
  data() {
    return {

    }
  },
  computed: {
    /*
    	 * 是否存在汇总
    	 */
    getSumFlag() {
      return this.sumable || this.checkSumable
    }
  },
  watch: {

  },
  created() {

  },
  mounted() {

  },
  beforeDestroy() {

  },
  methods: {
    /*
         * 折叠展开
         */
    handleRowExpand(row, j) {
      this.$parent.$parent.handleRowExpand(row, j)
    },
    /*
    	 * 单击行
    	 */
    handleClickRows(index) {
      this.$emit('bsx-click-row', index)
    },
    /*
    	 * 滑入行
    	 */
    handleMouseEnterRows(index, flag) {
      if (!flag && index >= this.rows.length) {
        return
      }
      this.$emit('bsx-mouseenter-row', {
        index: index,
        isAdd: flag
      })
    },
    /*
    	 * 滑出行
    	 */
    handleMouseLeaveRows(index, flag) {
      if (!flag && index >= this.rows.length) {
        return
      }
      this.$emit('bsx-mouseleave-row', {
        index: index,
        isAdd: flag
      })
    },
    /*
    	 * 获取汇总flag
    	 */
    getSumSlotFlag(index, col) {
      let n = 0
      if (this.sumable) {
        n++
      }
      if (this.checkSumable) {
        n++
      }
      if (this.sumable && col.sumable && index == this.totalRows.length - n) {
        return true
      }
      if (this.checkSumable && col.checkSumable && index == this.totalRows.length - n + (this.sumable ? 1 : 0)) {
        return true
      }
    },
    /*
    	 * 获取是否边框flag
    	 */
    getBorderFlag(index) {
      let n = 0
      if (this.sumable) {
        n++
      }
      if (this.checkSumable) {
        n++
      }
      return index >= this.totalRows.length - n - 1 && index != this.totalRows.length - 1
    },
    /*
    	 * 获取序号
    	 */
    getIndexValue(index, flag, isAdd) {
      if (flag && !isAdd) {
        let n = 0
        for (let i = 0; i < this.totalRows.length; i++) {
          if (!this.totalRows[i].showabled && i < index) {
            n++
          }
          if (i >= index) {
            break
          }
        }
        index -= n
      }
      return (this.currentPage - 1) * this.pageSize + index + 1 + (isAdd ? 0 : this.adds.length)
    },
    /*
    	 * 获取隔行变色
    	 */
    getStripeFlag(index, row) {
      return this.stripe && !row.unstripe && this.getIndexValue(index, true) % 2 == 0
    }
  }
}
</script>

<style lang="scss">

</style>
