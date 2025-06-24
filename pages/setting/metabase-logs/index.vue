<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters" 
      :headers="headers"
      autoUpdate="/setting/metabase-logs"
      createUrl="/setting/metabase-logs/insert"
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
    filters: { key: "metabase" },
    title: "گزارشات متابیس",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان ", value: "value" }, { text: "شناسه داشبورد", value: "value_2" }];
  },
};
</script>
