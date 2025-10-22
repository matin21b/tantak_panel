<template>
  <div>
    <BaseTable
      url="/money-request/list"
      :headers="headers"
      :createUrl="insert_url"
      :BTNactions="btn_actions"
      ref="MoneyRequest"
    />

  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    request_id: "",
    insert_url: "/money-request/insert",
    show_dialog: false,
    title: "درخواست وجه",
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
  
      { text: "مقدار (ریال)", value: "value", type: "price" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_req_money,
      },
    ];
   
  },
  methods: {
    refresh() {
      this.$refs.MoneyRequest.getDataFromApi();
    },
  },
};
</script>
