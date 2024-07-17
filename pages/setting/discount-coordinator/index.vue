<template>
  <div>
    <BaseTable
      url="/discount-coordinator"
      :headers="headers"
      autoUpdate="/setting/discount-coordinator"
      createUrl="/setting/discount-coordinator/insert"
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
    filters: { key: "day_delete_basket" },
    title: "کد های تخفیف",
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
      { text: "درصد تخفیف", value: "discount" },
      {
        text: "نقش انتخاب شده",
        value: "role_id",
        filterType: "select",
        items: [
          { text: "سرپرست هماهنگ کننده", value: "38d9a458-5aba-4274-a71f-877e2bf655d4" },
          { text: "مدیر هماهنگ کننده", value: "7e6e5f8b-84db-48f5-bd93-7e38fcc30c2e" },
          { text: "هماهنگ کننده", value: "b659c438-531d-4aab-93e0-58f5835c1cb2" },
        ],
      },
    ];
  },
};
</script>
