/*
 * grid computed混入
 *
 * @Author: 谢力
 * @Date:   2018-06-06 14:08:51
 * @Last Modified by:   谢力
 * @Last Modified time: 2018-06-06 14:08:56
 */
import {
  isPlainObject,
  isNumber
} from '@/utils/tool'

export default {
  data() {
    return {
      scrollThumbSize: navigator.userAgent.toLowerCase().indexOf('win') > -1 ? 0 : 20,
      headerHeight: 0,
      headCheckbox: {
        disabled: false,
        value: false
      }
    }
  },
  computed: {
    /*
    	 * 获取左侧锁住宽度
    	 */
    getLockedLeftWidth() {
      let width = 0
      if (this.head.left && this.head.left.length) {
        this.head.left.forEach(col => {
          if (col.visible) {
            width += parseFloat(col.width)
          }
        })
      }
      return width
    },
    /*
    	 * 获取右侧锁住宽度
    	 */
    getLockedRightWidth() {
      let width = 0
      if (this.head.right && this.head.right.length) {
        this.head.right.forEach(col => {
          if (col.visible) {
            width += parseFloat(col.width)
          }
        })
      }
      return width
    },
    /*
    	 * 获取边框class
    	 */
    getBorderClass() {
      return {
        'is-leaf': this.isBorder
      }
    },
    // 判断PC系统
    windowsClass() {
      const PCType = navigator.userAgent.toLowerCase()
      if (PCType.indexOf('win') > -1) {
        const arr = Array.from(document.getElementsByClassName('app_grid-body_center_scroll'))
        return arr.length ? '' : 'windowsSty'
      }
    },
    /*
    	 * 获取中间class
    	 */
    getCenterClass() {
      if (!this.isBorder) {
        const o = {
          'no-leaf': !this.isBorder
        }
        if (this.scrollHorizontalState) {
          if (this.head.left.length) {
            o['no-leaf-left'] = this.scrollHorizontalState.left
            // o['no-leaf-left']=true;
          }
          if (this.head.right.length) {
            o['no-leaf-right'] = this.scrollHorizontalState.right
            // o['no-leaf-right']=true;
          }
        }
        return o
      }
    },
    /*
    	 * 获取中间滚动占位样式
    	 */
    getBodyThumbStyle() {
      if (this.lockedCenterWidth) {
        return {
          paddingBottom: `${this.scrollThumbSize}px`
        }
      }
    },
    /*
    	 * 获取header样式
    	 */
    getHeaderStyle() {
      if (this.headerHeight) {
        return {
          height: `${Math.max(34, this.headerHeight)}px`
        }
      }
    },
    /*
    	 * 获取body样式
    	 */
    getBodyStyle() {
      const q = this.lockedCenterWidth ? this.scrollThumbSize : 0
      if (isNumber(this.listHeight)) {
        return {
          height: `${Number(this.listHeight) + q}px`
        }
      } else if (!this.tableStatus) {
        return {
          height: `300px`
        }
      } else if (this.list.length) {
        let m = 0
        if (this.getSumFlag) {
          m += 1
        }
        if (this.getCheckSumFlag) {
          m += 1
        }
        return {
          height: `${(Math.min(this.list.length, this.pageSize) + m) * 36 + q}px`
        }
      }
    },
    /*
         * 获取是否存在汇总
         */
    getSumFlag() {
      for (const key in this.sourceCol) {
        if (this.sourceCol[key].sumable && this.sourceCol[key].type == 'input') {
          return true
        }
      }
      return false
    },
    /*
         * 获取是否存在选中汇总
         */
    getCheckSumFlag() {
      for (const key in this.sourceCol) {
        if (this.sourceCol[key].checkSumable && this.sourceCol[key].type == 'input') {
          return true
        }
      }
      return false
    },
    /*
         * 获取全选indeterminate状态
         */
    getCheckboxIndeterminate() {
      if (this.checkType == 'checkbox') {
        let flag = true
        let isHas = false
        let isDisabled = true
        const list = this.adds.concat(this.list)
        list.forEach(row => {
          if (row.checked) {
            isHas = true
          }
          flag = flag && row.checked
          isDisabled = isDisabled && row.disabled
        })
        this.headCheckbox.disabled = this.isDisabled || !this.tableStatus || isDisabled || (!this.adds.length && !this.list.length)
        this.headCheckbox.value = flag && isHas
        return isHas && !flag
      }
      return false
    },
    /*
         * 获取请求level
         */
    getAxiosIndex() {
      const o = {}
      if (this.axiosName && isPlainObject(this.axiosName)) {
        Object.keys(this.axiosName).forEach((key, index) => {
          o[key] = index
        })
      }
      return o
    },
    /*
         * 获取列基础索引
         */
    _getColumnBaseIndex() {
      let n = 0
      if (this.checkType) {
        n++
      }
      if (this.showIndex) {
        n++
      }
      return n
    },
    /*
         * 获取列基础flag
         */
    _getColumnBaseFlag() {
      if (this.head.left.length) {
        if (this.head.left.length == 1 && (this.checkType || this.showIndex)) {
          return true
        } else if (this.head.left.length == 2 && this.checkType && this.showIndex) {
          return true
        }
      }
    }
  },
  watch: {
    lockedCenterWidth() {
      this.$nextTick(() => {
        const head_center_scroll = this.$refs.head_center_scroll
        const body_center_scroll = this.$refs.body_center_scroll
        head_center_scroll && head_center_scroll.update()
        body_center_scroll && body_center_scroll.update()
      })
    }
  }
}
