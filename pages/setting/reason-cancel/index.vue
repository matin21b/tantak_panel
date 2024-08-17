<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      createUrl="/setting/reason-cancel/insert"
      autoUpdate="/setting/reason-cancel"
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
    filters: { key: "reason_cancel" },
    title: "علت های کنسلی سبد خرید",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "علت",
        value: "value",
      },
    ];
  },
};
</script>
