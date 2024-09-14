<template>
  <v-row class="d-flex justify-center mt-5">
    <v-col cols="12">
      <BaseTable
        url="/product-request"
        :headers="headers"
        :rootBody="root_body"
        ref="ProductRequest"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  components: {},
  props: {
    modelId: { default: null },
  },
  data: () => ({
    title: "درخواست موجودی",
    headers: [],
    payments: [],
    root_body: {},
    request: "",
    basket_id: "",

    status_payment: "",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.root_body = {
      user_id: this.modelId,
    };
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
        text: "مجموع قیمت (ریال)",
        type: "price",
        value: "total_price",
      },
      {
        text: "وزن (گرم)",
        type: "price",
        value: "total_weight",
      },
      {
        text: "شماره فاکتور",
        value: "order_number",
      },
      {
        text: "کد نمایندگی",
        value: "agency_code",
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_invitor,
      },
      {
        text: "مرحله",
        value: "step",
        filterType: "select",
        items: this.$store.state.static.step_invitor,
      },
      {
        text: "نوع",
        value: "type",
        filterType: "select",
        items: this.$store.state.static.type_invitor,
      },
      {
        text: "وضعیت پرداخت",
        value: "status_payment",
        filterType: "select",
        items: this.$store.state.static.status_payment_invitor,
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },

  methods: {
    refresh() {
      this.$refs.ProductRequest.getDataFromApi();
    },
  },
};
</script>
<style scoped></style>
