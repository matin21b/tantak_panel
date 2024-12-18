<template>
  <div>
    <BaseTable
      url="/basket"
      :headers="headers"
      :BTNactions="btn_actions"
      :filters="filters"
      :root-body="root_body"
      :extraBtn="extra_btn"
    />
    <DetailsBaskets
      v-if="show_details"
      :dialog="show_details"
      :data="data"
      @closeDialog="show_details = false"
    />
  </div>
</template>
<script>
import DetailsBaskets from "@/components/Product/DetailsBaskets.vue";

export default {
  components: {
    DetailsBaskets,
  },
  props: {
    id: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      panel: 1,
      continue_form: false,
      loading: false,
      filters: {},
      response: [],
      headers: [],
      product: { product_id: "" },
      root_body: "",
      url: "",
      product_var_info: "",
      valid: true,
      update: false,
      btn_actions: [],
      show_details: false,
      data: {},
    };
  },

  beforeMount() {
    this.filters = {
      sale_agency_id: {
        op: "=",
        value: this.id,
      },
    };
    //   this.root_body = { sale_agency_id: this.branchId };
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
        filterCol: "body.user.first_name",
        text: "نام",
        value: (body) => {
          if (body.user) {
            return body.user.first_name;
          } else {
            return "--";
          }
        },
      },
      {
        disableSort: "true",
        filterCol: "user.last_name",

        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name;
          } else {
            return "--";
          }
        },
      },

      {
        text: "شماره فاکتور",
        value: "factor_number",
      },

      {
        text: "مرحله",
        filterType: "select",
        value: "step",
        items: this.$store.state.static.step_basket_refral,
      },

      {
        text: "وضعیت سبد",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status_basket_refral,
      },
    ];
    this.extra_btn = [
      {
        text: "برگشت",
        icon: "arrow_circle_right",
        color: "red",
        fun: () => {
          this.backStep();
        },
      },
    ];
    this.btn_actions = [
      {
        text: "نمایش جزییات",
        icon: "",
        color: "red",
        fun: (body) => {
          this.show_details = true;
          this.data = body;
        },
      },
    ];
  },
  methods: {
    backStep() {
      this.$emit("backStep");
    },
  },
};
</script>
