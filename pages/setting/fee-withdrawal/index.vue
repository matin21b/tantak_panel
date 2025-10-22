<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters" 
      :headers="headers"
      autoUpdate="/setting/fee-withdrawal"
      createUrl="/setting/fee-withdrawal/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "withdraw_sales_commission" },
    title: "حق برداشت کارمزد",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "تعداد روز ", value: "value" }];
  },
};
</script>
