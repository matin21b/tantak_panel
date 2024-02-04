<template>
  <div>
    <BaseTable
      url="/collective-sell"
      :headers="headers"
      :autoUpdate="updateUrl"
      :autoDelete="deleteUrl"
      :createUrl="createUrl"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    createUrl: "/collective-sell/insert",
    deleteUrl: "/collectivesell/delete",
    updateUrl: "/collective-sell",
    headers: [],
    items: [],
    title: "فروش تجمیعی",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
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
        text: "نام شعبه",
        value: (body) => {
          if (body.branch) {
            return body.branch.name;
          }
        },
      },
      {
        text: "کد شعبه",
        value: (body) => {
          if (body.branch) {
            return body.branch.branch_code;
          }
        },
      },
      {
        text: "نوع فروش",
        value: (body) => {
          if (body.branch) {
            let sell_type = this.$getItemEnum(
              this.$store.state.static.sell_type,
              body.branch.sell_type
            );
            return sell_type;
          }
        },
        filterType: "select",
      },
      { text: "اولویت", value: "priority" },
    ];
  },
  methods: {},
};
</script>

<style>
</style>