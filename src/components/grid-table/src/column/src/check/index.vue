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
          :class="{ actived: item.value == col.prop }"
          :label="item.value"
          :key="i"
          v-for="(item, i) in modelList"
        >
          <div class="flex-row align-between-row">
            <span class="flex1">{{ item.title }}</span>
          </div>
        </el-checkbox>
      </el-checkbox-group>
    </bsx-scrollbar>
    <div class="app_grid-column-bottom">
      <div class="flex-row">
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
      <div class="app_grid-column-hr flex-row">
        <el-button
          class="flex1"
          type="primary"
          size="small"
          plain
          @click="restore"
          >一键还原</el-button
        >
      </div>
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
      default: [],
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
     * 一键还原
     */
    restore() {
      this.getGrid.hideCellPopper();
      this.getGrid.handleRestore("visible");
    },
    /*
     * 保存
     */
    save() {
      let labels = {};
      this.modelVal.forEach((key) => {
        labels[key] = true;
      });
      this.modelList = this.modelList.map((item) => {
        item.checked = !!labels[item.value];
        return item;
      });
      this.getGrid.hideCellPopper();
      this.getGrid.handleColumnToggleShowChange({
        list: this.modelList,
      });
      this.$emit("change-save");
    },
    /*
     * 重置
     */
    reset(val) {
      val = val || this.list;
      this.modelList = val;
      this.modelVal = this.modelList
        .filter((item) => {
          return item.checked;
        })
        .map((item) => {
          return item.value;
        });
    },
  },
};
</script>
