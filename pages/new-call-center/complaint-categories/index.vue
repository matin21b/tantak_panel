<template>
  <div>
    <BaseTable
      :filters="filters"
      :headers="headers"
      url="/complaint-category"
      autoDelete="/complaint-category/delete"
      autoUpdate="/new-call-center/complaint-categories"
      createUrl="/new-call-center/complaint-categories/insert"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "category_role" },
    title: "دسته  بندی شکایات",
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
      { text: "عنوان ", value: "category" },
      {
        text: "نقش مربوط ",
        value: (body) => {
          let text = body.role?.name;
          return text;
        },
      },
    ];
  },
};
</script>
