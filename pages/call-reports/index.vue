<template>
  <div>
  <v-col cols="12">
  <Filters />
  </v-col>
    <!-- <BaseTable
      url="/message/issabel-request-call/history"
      :filters="filters"
      :headers="headers"
      createUrl="/setting/category-task/insert"
      autoUpdate="/setting/category-task"
      autoDelete="/setting/delete"
    /> -->

  </div>
</template>

<script>
import Filters from "@/components/CallReports/Filters.vue";
export default {
  components: { Filters },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "گزارشات تماس",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [];
  },
};
</script>
