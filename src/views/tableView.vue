<template>
  <bsx-grid
    ref="gridTable"
    :list-height="300"
    :axios-auto="false"
    axios-url="/cct/rev/primage/pageQuery"
    :axios-map="handleGridAxiosMap"
    :orderable="true"
    check-type="checkbox"
    :check-row-trigger-click="true"
    grid-id="demo-grid-id-1"
    :sort-axios-enabled="false"
    :page-intercept="clearSelection"
    highlight-current-row
    @bsx-grid-check-change="handleGridCheckChange"
    style="width: 100%"
  >
    <bsx-grid-column
      align="center"
      label="结算申请单号"
      prop="applyNo"
      width="110"
      show-overflow-tooltip
      :format="formatValue"
    />
    <bsx-grid-column
      align="center"
      label="结算件数"
      prop="totalCount"
      width="130"
      show-overflow-tooltip
      :format="formatValue"
    />
    <bsx-grid-column
      align="center"
      label="总金额"
      prop="totalAmount"
      width="130"
      show-overflow-tooltip
      :format="formatValue"
    />
    <bsx-grid-column
      align="center"
      label="驳回状态"
      prop="planLineStatus"
      width="160"
      show-overflow-tooltip
    />
  </bsx-grid>
</template>

<script>
export default {
  name: "TableView",
  data() {
    return {
      selectsome:[],
    };
  },
  methods: {
    formatValue(index, value, col, row) {
      if (value === "null") value = "";
      return this.formatText(value);
    },
    handleGridAxiosMap(type, result) {
      switch (type) {
        case 'send' :
          return { ...this.filter }
        case 'response' :
          return result
      }
    },
    handleGridCheckChange({ rows }) {
      this.selectsome = rows   
    },
    clearSelection(next) {
      this.$emit('selectionClick', [])
      next()
    }
  },
};
</script>

<style></style>
