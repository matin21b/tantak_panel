<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/best-buy-product"
        :headers="headers"
        :BTNactions="btn_actions"
        :extraBtn="extra_btn"
        autoDelete="/best-buy-product/delete"
        ref="SuggestedProduct"
      />
      <SuggestedForm
        v-if="show_suggested_form"
        :model-id="product_id"
        :dialog="show_suggested_form"
        @closeDialog="closeDialog"
        @relod="refresh"
      />
    </v-col>
  </v-row>
</template>

<script>
import SuggestedForm from "@/components/Product/SuggestedForm.vue";
export default {
  components: { SuggestedForm },
  data: () => ({
    headers: [],

    filters: {},
    btn_actions: [],
    extra_btn: [],
    product_id: "",
    show_suggested_form: false,
    title: "لیست محصولات پیشنهادی",
  }),
  beforeMount() {
    this.headers = [
    {
        title: " ",
        value: "main_image",
        type: "image",
        disableSort: "true",
        filterable: false,
        size: "small",
      },
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

      { text: "نام محصول", value: "name" },
      { text: "بارکد محصول", value: "barcode" },
      { text: "قیمت پایه (ریال)", value: "base_price", type: "price" },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "بروزرسانی",
        color: "red",
        fun: (body) => {
          this.show_suggested_form = true;
          this.product_id = body.id;
        },
      },
    ];
    this.extra_btn = [
      {
        text: "جدید",
        color: "primary",
        icon: "add_circle",
        fun: (body) => {
          this.show_suggested_form = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    closeDialog() {
      this.show_suggested_form = false;
      this.product_id = "";
    },
    refresh() {
      this.$refs.SuggestedProduct.getDataFromApi();
    },
  },
};
</script>
