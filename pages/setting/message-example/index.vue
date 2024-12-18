<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      createUrl="/setting/message-example/insert"
      autoUpdate="/setting/message-example"
      autoDelete="/setting/delete"
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
    filters: { key: "message_example" },
    title: "پیام های آماده",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان پیام", value: "value" }];
  },
};
</script>
