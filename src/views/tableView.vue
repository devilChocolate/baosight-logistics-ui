<template>
  <bsx-grid
    ref="gridTable"
    :data-source="dataSource"
    :page-limit="200"
    :orderable="true"
    :is-child-grid="true"
    :page-enabled="false"
    grid-id="demo-grid-id-2"
    highlight-current-row
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
      dataSource: [],
    };
  },
  methods:{
    formatValue(index, value, col, row) {
      if (value === 'null') value = ''
      return this.formatText(value)
    },
  }
};
</script>

<style></style>
