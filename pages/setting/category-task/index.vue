<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      createUrl="/setting/category-task/insert"
      autoUpdate="/setting/category-task"
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
    filters: { key: "category_task" },
    title: "دسته بندی وظیفه ها",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [{ text: "عنوان دسته بندی", value: "value" }];
  },
};
</script>
