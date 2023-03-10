<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
  <div class="result-container">
    <div class="app_grid">
      <div class="app_grid-column-hidden">
        <slot />
      </div>
      <template v-if="visible">
        <div v-if="$slots.prefix" class="app_grid-tool flex-row align-stretch" :class="getBorderClass">
          <slot name="prefix" />
        </div>
        <div class="app_grid-main" :class="[getBorderClass]">
          <div v-if="dragX" class="app_grid-column-drag-line" :style="{left:`${dragX}px`}" />
          <div v-if="showHeader" class="app_grid-head flex-row align-stretch" :style="getHeaderStyle">
            <div
              v-if="head.left&&head.left.length"
              class="app_grid-left app_grid-box"
              :class="getBorderClass"
              :style="{width:`${getLockedLeftWidth}px`}"
            >
              <grid-table
                ref="head_left_table"
                type="head"
                locked="left"
                :is-border="isBorder"
                :check-type="checkType"
                :cols="head.left"
              >
                <template v-slot:header="{col}">
                  <column-header
                    :ref="`head_column_${col.prop}`"
                    locked="left"
                    :check-type="checkType"
                    :head-checkbox="headCheckbox"
                    :indeterminate="getCheckboxIndeterminate"
                    :col="col"
                    :sort-axios-enabled="sortAxiosEnabled"
                    :sort="sortParam"
                    @bsx-column-sort="handleColumnSortChange"
                    @bsx-column-drag="handleColumnWidthChange"
                    @bsx-cell-change="handleCheckBoxChange"
                  >
                    <column-tool
                      slot="tool"
                      :is-expand="isHasChildExpand"
                      :table-status="tableStatus"
                      :list="list"
                      :col="col"
                      :show-order="orderable"
                      :order-list="getColumnsOrderList"
                      :visible-list="getColumnsToggleShowList"
                    />
                  </column-header>
                </template>
              </grid-table>
            </div>
            <bsx-scrollbar
              v-if="head.center&&head.center.length"
              ref="head_center_scroll"
              class="app_grid-center app_grid-box flex1"
              :class="[getBorderClass,getCenterClass]"
              :show-thumb="false"
              @bsx-scrollbar-scroll="handleScroll($event,'center','body')"
            >
              <div class="app_grid-scroll" :style="{width:lockedCenterWidth?`${lockedCenterWidth}px`:'100%'}">
                <grid-table
                  ref="head_center_table"
                  type="head"
                  locked="center"
                  :is-border="isBorder"
                  :check-type="checkType"
                  :cols="head.center"
                >
                  <template v-slot:header="{col}">
                    <column-header
                      :ref="`head_column_${col.prop}`"
                      locked="center"
                      :check-type="checkType"
                      :head-checkbox="headCheckbox"
                      :indeterminate="getCheckboxIndeterminate"
                      :col="col"
                      :sort-axios-enabled="sortAxiosEnabled"
                      :sort="sortParam"
                      @bsx-column-sort="handleColumnSortChange"
                      @bsx-column-drag="handleColumnWidthChange"
                    >
                      <column-tool
                        slot="tool"
                        :is-expand="isHasChildExpand"
                        :table-status="tableStatus"
                        :list="list"
                        :col="col"
                        :show-order="orderable"
                        :order-list="getColumnsOrderList"
                        :visible-list="getColumnsToggleShowList"
                      />
                    </column-header>
                  </template>
                </grid-table>
              </div>
            </bsx-scrollbar>
            <div
              v-if="head.right&&head.right.length"
              class="app_grid-right app_grid-box"
              :class="getBorderClass"
              :style="{width:`${getLockedRightWidth}px`}"
            >
              <grid-table
                ref="head_right_table"
                type="head"
                locked="right"
                :is-border="isBorder"
                :check-type="checkType"
                :cols="head.right"
              >
                <template v-slot:header="{col}">
                  <column-header
                    :ref="`head_column_${col.prop}`"
                    locked="right"
                    :check-type="checkType"
                    :head-checkbox="headCheckbox"
                    :indeterminate="getCheckboxIndeterminate"
                    :col="col"
                    :sort-axios-enabled="sortAxiosEnabled"
                    :sort="sortParam"
                    @bsx-column-sort="handleColumnSortChange"
                    @bsx-column-drag="handleColumnWidthChange"
                  >
                    <column-tool
                      slot="tool"
                      :is-expand="isHasChildExpand"
                      :table-status="tableStatus"
                      :list="list"
                      :col="col"
                      :show-order="orderable"
                      :order-list="getColumnsOrderList"
                      :visible-list="getColumnsToggleShowList"
                    />
                  </column-header>
                </template>
              </grid-table>
            </div>
          </div>
          <div ref="body" class="app_grid-body flex-row" :class="{'align-stretch':getEmptyFlag}" :style="getBodyStyle">
            <div v-if="getEmptyFlag" class="app_grid-empty flex1 flex-row align-center" :class="{in:!!tableStatus}">
              <slot name="empty" />
            </div>
            <div
              v-else
              class="app_grid-warp flex1 flex-row align-stretch"
              :class="{in:!!tableStatus}"
            >
              <template v-if="adds.length||list.length">
                <bsx-scrollbar
                  v-if="head.left&&head.left.length"
                  ref="body_left_scroll"
                  :show-thumb="false"
                  class="app_grid-left app_grid-box"
                  :class="getBorderClass"
                  :style="[getBodyThumbStyle,{width:`${getLockedLeftWidth}px`}]"
                  @bsx-scrollbar-scroll="handleScroll($event,'left','head')"
                >
                  <div class="app_grid-scroll">
                    <grid-table
                      ref="body_left_table"
                      type="body"
                      locked="left"
                      :click-row-index="clickRowIndex"
                      :is-child="isChildGrid"
                      :check-type="checkType"
                      :cols="head.left"
                      :adds="adds"
                      :rows="list"
                      :stripe="stripe"
                      :sumable="getSumFlag"
                      :check-sumable="getCheckSumFlag"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      :total-rows="getRowsData(head.left)"
                      @bsx-click-row="handleClickRow"
                      @bsx-mouseenter-row="handleMouseEnterRows"
                      @bsx-mouseleave-row="handleMouseLeaveRows"
                    >
                      <template v-slot:sum="{text,index}">
                        <div v-if="showTotalFlag(index,true)" class="bsx-form-cell">{{ text }}</div>
                      </template>
                      <template v-slot:adds="{row,col,value,code,index}">
                        <cell
                          :key="`left-${col.prop}-true-${index}`"
                          :ref="`${col.prop}-true-${index}`"
                          :editabled="true"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="true"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                      <template v-slot:list="{row,col,value,code,index}">
                        <cell
                          :key="`left-${col.prop}-false-${index}`"
                          :ref="`${col.prop}-false-${index}`"
                          :editabled="cellState[index]&&cellState[index][col.prop]"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="false"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                    </grid-table>
                  </div>
                </bsx-scrollbar>
                <bsx-scrollbar
                  v-if="head.center&&head.center.length"
                  ref="body_center_scroll"
                  class="app_grid-center app_grid-box flex1 app_grid-body_center_scroll"
                  :class="[getBorderClass,getCenterClass,windowsClass]"
                  :style="getBodyThumbStyle"
                  :margin="2"
                  :space="4"
                  :thumb-size="scrollSize"
                  @bsx-scrollbar-scroll="handleScroll($event,'center','head')"
                >
                  <div class="app_grid-scroll" :style="{width:lockedCenterWidth?`${lockedCenterWidth}px`:'100%'}">
                    <grid-table
                      ref="body_center_table"
                      type="body"
                      locked="center"
                      :click-row-index="clickRowIndex"
                      :is-child="isChildGrid"
                      :check-type="checkType"
                      :cols="head.center"
                      :adds="adds"
                      :rows="list"
                      :stripe="stripe"
                      :sumable="getSumFlag"
                      :check-sumable="getCheckSumFlag"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      :total-rows="getRowsData(head.center)"
                      @bsx-click-row="handleClickRow"
                      @bsx-mouseenter-row="handleMouseEnterRows"
                      @bsx-mouseleave-row="handleMouseLeaveRows"
                    >
                      <template v-slot:sum="{text,index}">
                        <div v-if="showTotalFlag(_getColumnBaseFlag?index+_getColumnBaseIndex:index,_getColumnBaseFlag)" class="bsx-form-cell">{{ text }}</div>
                      </template>
                      <template v-slot:adds="{row,col,value,code,index}">
                        <cell
                          :key="`center-${col.prop}-true-${index}`"
                          :ref="`${col.prop}-true-${index}`"
                          :editabled="true"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="true"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                      <template v-slot:list="{row,col,value,code,index}">
                        <cell
                          :key="`center-${col.prop}-false-${index}`"
                          :ref="`${col.prop}-false-${index}`"
                          :editabled="cellState[index]&&cellState[index][col.prop]"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="false"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                      <template v-slot:expand="{row,index}">
                        <slot
                          v-if="row.children&&row.children.length"
                          name="expand"
                          :index="index"
                          :row="row"
                          :detail="row.children"
                          :checkType="checkType"
                        />
                      </template>
                    </grid-table>
                  </div>
                </bsx-scrollbar>
                <bsx-scrollbar
                  v-if="head.right&&head.right.length"
                  ref="body_right_scroll"
                  :show-thumb="false"
                  class="app_grid-right app_grid-box"
                  :class="getBorderClass"
                  :style="[getBodyThumbStyle,{width:`${getLockedRightWidth}px`}]"
                  @bsx-scrollbar-scroll="handleScroll($event,'right','head')"
                >
                  <div class="app_grid-scroll">
                    <grid-table
                      ref="body_right_table"
                      type="body"
                      locked="right"
                      :click-row-index="clickRowIndex"
                      :is-child="isChildGrid"
                      :check-type="checkType"
                      :cols="head.right"
                      :adds="adds"
                      :rows="list"
                      :stripe="stripe"
                      :sumable="getSumFlag"
                      :check-sumable="getCheckSumFlag"
                      :current-page="currentPage"
                      :page-size="pageSize"
                      :total-rows="getRowsData(head.right)"
                      @bsx-click-row="handleClickRow"
                      @bsx-mouseenter-row="handleMouseEnterRows"
                      @bsx-mouseleave-row="handleMouseLeaveRows"
                    >
                      <template v-slot:adds="{row,col,value,code,index}">
                        <cell
                          :key="`right-${col.prop}-true-${index}`"
                          :ref="`${col.prop}-true-${index}`"
                          :editabled="true"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="true"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                      <template v-slot:list="{row,col,value,code,index}">
                        <cell
                          :key="`right-${col.prop}-false-${index}`"
                          :ref="`${col.prop}-false-${index}`"
                          :editabled="cellState[index]&&cellState[index][col.prop]"
                          :index="index"
                          :row="row"
                          :value="value"
                          :col="col"
                          :is-add="false"
                          :add-rows-num="getTotalAddRowsNum"
                          :list-rows-num="getTotalListRowsNum"
                          @bsx-cell-change="handleCellChange(index,col,row,$event)"
                        />
                      </template>
                    </grid-table>
                  </div>
                </bsx-scrollbar>
              </template>
            </div>
          </div>
        </div>
        <div v-if="isBottom" class="app_grid-bottom" :class="getBorderClass">
          <slot v-if="$scopedSlots.suffix" name="suffix" />
          <div v-if="isPageRow" class="flex-row align-stretch pad-top-10 pad-bottom-10" :class="{'align-end-row':!$slots.bottom}">
            <div v-if="$slots.bottom" class="app_grid-bottom-tool flex1 flex-row align-stretch">
              <slot name="bottom" />
            </div>
            <div v-if="pageEnabled" class="app_grid-bottom-page">
              <el-pagination
                ref="pagination"
                background
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total"
                @size-change="handlePageSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import config from './config/index'
import gridTable from './table'
import cell from './cell'
import column from './column'
import columnTool from './column/tool'
import columnHeader from './column/header'
import mixinBase from './mixins/base'
import mixinMain from './mixins/main'
import mixinDom from './mixins/dom'
import mixinComponent from './mixins/component'
import mixinComputed from './mixins/computed'
import mixinAPI from './mixins/api'
import mixinHandler from './mixins/handler'
import mixinColumn from './mixins/column'
import mixinExcel from './mixins/excel'
import {
  createRandomUid
} from '@utils/tool.js'
import {
  getDomStyle
} from '@utils/dom.js'

export default {
  name: 'BsxGrid',
  data() {
    return {
      visible: false,
      head: {},
      scrollSize: navigator.userAgent.toLowerCase().indexOf('win') > -1 ? 6 : 12,
      sourceCol: {},
      dragX: null,
      lockedCenterWidth: null
    }
  },
  props: {
    ...config
  },
  components: {
    gridTable,
    cell,
    columnTool,
    columnHeader
  },
  mixins: [
    mixinBase,
    mixinMain,
    mixinDom,
    mixinComponent,
    mixinComputed,
    mixinAPI,
    mixinHandler,
    mixinColumn,
    mixinExcel
  ],
  computed: {
    /*
    	 * 获取是否显示底部(整块)插槽标记
    	 */
    isPageRow() {
      return this.$slots.bottom || this.pageEnabled
    },
    /*
    	 * 获取是否显示底部(整块内一部分)插槽标记
    	 */
    isBottom() {
      return this.isPageRow || this.$scopedSlots.suffix
    },
    /*
    	 * 获取当页新增数据长度
    	 */
    getTotalAddRowsNum() {
      return this.adds.length
    },
    /*
    	 * 获取当页非新增数据长度
    	 */
    getTotalListRowsNum() {
      return this.list.length
    },
    /*
    	 * 获取是否显示空插槽标记
    	 */
    getEmptyFlag() {
      return !this.total && !this.adds.length && this.$slots.empty
    },
    /*
         * 是否存在折叠子内容
         */
    isHasChildExpand() {
      return this.$scopedSlots.expand
    }
  },
  watch: {
    head() {
      this.lockedCenterWidth = this.getLockedCenterWidth()
    }
  },
  mounted() {
    this.head = this.getHeadData(this.$slots.default)
    !this.isBorder && this._getScrollState(0, false)
    this.visible = true
    this.$nextTick(this.init)
  },
  methods: {
    /*
    	 * 初始化
    	 */
    init() {
      this.refreshTableHeadRowsHeight()
      this._loading = this.initLoading()
      this._result = this.initResult()
      if (this.axiosAuto) {
            	this.getPageInfo(this.currentPage)
      } else {
            	this.showResult('没有数据')
      }
    },
    /*
    	 * 是否显示合计字样
    	 */
    showTotalFlag(index, flag) {
      return index == this._getColumnBaseIndex && (this.head.left.length ? flag : true)
    },
    /*
    	 * 获取所有行数据源
    	 */
    getRowsData(cols) {
      let rows = []
      const sum = {}
      const checkSum = {}
      cols.forEach(col => {
        if (col.type == 'input' || col.type == 'custom' || col.isIndex || (this.checkType && col.prop == this.checkType)) {
          if (col.sumable) {
            sum[col.prop] = this.getSum(this.list, col.prop)
          }
          if (col.checkSumable) {
            checkSum[col.prop] = this.getSum(this.getCheckedDisAddRows(), col.prop)
          }
          sum.unstripe = true
          checkSum.unstripe = true
        }
      })
      if (this.getSumFlag) {
        rows = rows.concat([sum])
      }
      if (this.getCheckSumFlag) {
        rows = rows.concat([checkSum])
      }
      return this.list.concat(rows)
    },
    /*
    	 * 获取汇总
    	 */
    getSum(rows, prop) {
      let sum = 0
      rows.forEach(row => {
        if (row.showabled) {
          sum += parseFloat(row[prop] || 0)
        }
      })
      return sum
    },
    /*
    	 * 获取表头数据
    	 */
    getHeadData(data) {
      const o = {
        left: [],
        center: [],
        right: []
      }
      const head = data.filter(item => {
        const instance = item.componentInstance
        const options = item.componentOptions
        return instance && options && options.tag == column.name
      }).map((item, i) => {
        return {
          instance: item.componentInstance,
          ...item.componentInstance.$props
        }
      }).map(item => {
        if (!item.prop) {
          item.prop = createRandomUid()
          item.unProp = true
        }
        if (this.isHasChildExpand) {
          // if(this.isChildGrid||this.isHasChildExpand){
          item.locked = 'center'
        }
        return item
      })
      head.forEach(item => {
        o[item.locked].push(item)
      })
      if (this.showIndex) {
        // const cell=(this.isChildGrid||this.isHasChildExpand)?o.center:o.left;
        const cell = this.isHasChildExpand ? o.center : o.left
        cell.unshift({
          label: '序号',
          align: 'center',
          isIndex: true,
          sortIndex: -9997,
          width: 50,
          disabled: false,
          visible: true,
          unSortIndex: true,
          // locked:(this.isChildGrid||this.isHasChildExpand)?'center':'left'
          locked: this.isHasChildExpand ? 'center' : 'left'
        })
      }
      if (this.checkType) {
        // const cell=(this.isChildGrid||this.isHasChildExpand)?o.center:o.left;
        const cell = this.isHasChildExpand ? o.center : o.left
        cell.unshift({
          type: this.checkType,
          align: 'center',
          sortIndex: -9998,
          width: 35,
          prop: this.checkType,
          disabled: false,
          visible: true,
          unSortIndex: true,
          // locked:(this.isChildGrid||this.isHasChildExpand)?'center':'left'
          locked: this.isHasChildExpand ? 'center' : 'left'
        })
      }
      if (this.isHasChildExpand) {
        // const cell=this.isChildGrid?o.center:o.left;
        const cell = o.left
        cell.unshift({
          align: 'center',
          isExpand: true,
          sortIndex: -9999,
          width: 25,
          disabled: false,
          visible: true,
          unSortIndex: true,
          // locked:this.isChildGrid?'center':'left'
          locked: 'left'
        })
      }
      Object.keys(o).map(locked => {
        o[locked] = o[locked].map((item, i) => {
          item = {
            sortIndex: item.unSortIndex ? item.sortIndex : i,
            ...item
          }
          if (item.prop) {
            this.sourceCol[item.prop] = item
          }
          return item
        })
    		})
      this._columns = {}
      Object.keys(this.sourceCol).map(key => {
        this._columns[key] = {
          visible: this.sourceCol[key].visible,
          locked: this.sourceCol[key].locked,
          sortIndex: this.sourceCol[key].sortIndex
        }
      })
      return o
    },
    /*
    	 * 获取中间宽度
    	 */
    getLockedCenterWidth() {
      if (this.$el) {
        let width = 0
        const style = getDomStyle(this.$el)
        const q = this.isBorder ? 1 : 0
        const m = this.head.left && this.head.left.length ? q : 0
        const n = this.head.right && this.head.right.length ? q : 0
        const warpWidth = parseFloat(style.width) - this.getLockedLeftWidth - this.getLockedRightWidth - m - n
        if (this.head.center && this.head.center.length) {
          this.head.center.forEach(col => {
            if (col.visible) {
              width += parseFloat(col.width)
            }
          })
        }
        if (width > warpWidth) {
          return width
        }
      }
    }
  }
}
</script>