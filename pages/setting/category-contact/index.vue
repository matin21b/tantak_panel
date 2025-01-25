<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoDelete="/setting/delete"
      autoUpdate="/setting/category-contact"
      createUrl="/setting/category-contact/insert"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "category_contact" },
    title: "دسته بندی  مخاطبین",
  }),
  beforeMount() {
    this.headers = [
      { text: "عنوان ", value: "value" },
      { text: "توضیحات ", value: "value_2" },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
