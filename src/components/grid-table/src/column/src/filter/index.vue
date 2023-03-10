<!-- /*
 * @Author: 谢力
 * @Date:   2019-11-06
 * @Last Modified by:   谢力
 * @Last Modified time: 2019-11-07
 */ -->
<template>
  <div class="app_grid-column-info">
    <bsx-scrollbar
      class="app_grid-column-main"
      :margin="8"
      :space="5"
      :thumb-size="4"
    >
      <el-checkbox-group
        v-model="modelVal"
        class="flex-col app_grid-column-group"
      >
        <el-checkbox
          class="flex-row align-center-row"
          :label="item.value"
          :key="i"
          v-for="(item, i) in modelList"
        >
          <div class="flex-row align-between-row">
            <span class="flex1" v-html="item.title"></span>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </bsx-scrollbar>
    <div class="flex-row app_grid-column-bottom">
      <el-button type="primary" size="small" class="flex1" @click="save"
        >保存</el-button
      >
      <el-button
        type="primary"
        size="small"
        plain
        class="flex1"
        @click="reset(list)"
        >重置</el-button
      >
    </div>
  </div>
</template>

<script>
import mixinCommon from "../mixins/common";

export default {
  data() {
    return {
      modelList: [],
      modelVal: [],
    };
  },
  props: {
    /*
     * 数据列表
     */
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mixins: [mixinCommon],
  watch: {
    list: {
      handler(val) {
        this.reset(val);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /*
     * 保存
     */
    save() {
      let labels = {},
        indexs = [];
      this.modelVal.forEach((key) => {
        labels[key] = true;
      });
      this.modelList = this.modelList.forEach((item) => {
        if (!labels[item.value]) {
          indexs = indexs.concat(item.indexs);
        }
      });
      this.getGrid.hideCellPopper();
      this.getGrid.handleColumnFilterChange({
        indexs: indexs,
      });
      this.$emit("change-save");
    },
    /*
     * 重置
     */
    reset(val) {
      val = (val || this.list).map((row, i) => {
        const cell =
          this.getGrid.getRowCellComponent(i)[this.col.prop].component;
        let label = cell.$refs.box.getVal;
        if (cell.$scopedSlots.default) {
          var slot = cell.$scopedSlots.default()[0];
          if (slot.elm) {
            label = slot.elm.innerHTML;
          } else {
            let el = document.createElement(slot.tag || "span");
            if (slot.tag) {
              el.className = slot.data.staticClass;
              el.innerHTML = slot.children[0].text;
            } else {
              el.innerHTML = slot.text;
            }
            label = el.innerHTML;
          }
        }
        return {
          checked: row.showabled,
          value: row[this.col.prop],
          title: label,
        };
      });
      this.modelList = this.distinctArray(val);
      this.modelVal = this.modelList
        .filter((item) => {
          return item.checked;
        })
        .map((item) => {
          return item.value;
        });
    },
    /*
     * 去重
     */
    distinctArray(rows) {
      let o = {};
      rows.forEach((row, i) => {
        if (!o[row.value]) {
          o[row.value] = {
            index: [i],
            row: row,
          };
        } else {
          o[row.value].index.push(i);
        }
      });
      return Object.keys(o).map((key) => {
        return {
          checked: o[key].row.checked,
          value: o[key].row.value,
          title: o[key].row.title,
          indexs: o[key].index,
        };
      });
    },
  },
};
</script>
