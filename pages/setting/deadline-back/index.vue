<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/deadline-back"
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
    filters: { key: "deadline_back" },
    title: "مهلت برگشت کالا",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "عنوان", value: "value" },
      {
        text: "تعداد روز",
        value: (body) => {
          let days = JSON.parse(body.value_json).amount;
   
          return days
        },
      },
    ];
  },
};
</script>
