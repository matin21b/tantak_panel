<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent fullscreen>
      <v-card>
        <v-col cols="12" class="primary white--text d-flex align-center">
          <h1 class="font_18">تاریخچه استفاده ا ز کد تخفیف</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon color="white"> close </v-icon>
          </v-btn>
        </v-col>
        <BaseTable
          url="/coupon-log"
          :headers="headers"
          :extraBtn="extra_btn"
          :rootBody="root_body"
          :rowColor="rowColor"
        />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },

    couponId: {
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
      btn_actions: [],
      extra_btn: [],
      product: { product_id: "" },
      root_body: {},
      url: "",
      product_var_info: "",
      valid: true,
      update: false,
      form: {
        skock: "",
        description: "",
        save_skock: "",
        sale_agency_id: "",
        product_var_id: "",
      },
    };
  },
  beforeMount() {
    this.root_body = { coupon_id: this.couponId };
  },
  mounted() {
    this.headers = [
      {
        text: "تاریخ ثبت",
        filterCol: "created_at",
        filterType: "date",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(
              body.created_at,
              "YYYY-MM-DDTHH:mm:ss",
              "jYYYY/jMM/jDD"
            );
          } else {
            return "فعال نشده";
          }
        },
      },

      {
        text: "نام کاربر",
        filterCol: "user.first_name",
        value: (body) => {
          if (Boolean(body.user)) {
            let text = body.user.first_name ? body.user.first_name : "-";
            return text;
          }
        },
      },
      {
        text: "نام خانوادگی",
        filterCol: "user.first_name",
        value: (body) => {
          if (Boolean(body.user)) {
            let text = body.user.last_name ? body.user.last_name : "-";
            return text;
          }
        },
      },     
       {
        text: "شماره همراه",
        filterCol: "user.username",
        value: (body) => {
          if (Boolean(body.user)) {
            let text = body.user.username ? body.user.username : "-";
            return text;
          }
        },
      },
   


      {
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.coupon.is_public) {
            return true;
          } else {
            return false;
          }
        },
        text: "عمومی",
      },
      {
        type: "boolean",
        filterable: false,
        value: (body) => {
          if (body.coupon.all_products) {
            return true;
          } else {
            return false;
          }
        },
        text: "قابل استفاده برای همه محصولات",
      },

      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.inventory_status,
      },
    ];

    this.btn_actions = [
      {
        icon: "visibility",
        color: "red",
        text: "نمایش فایل",
        fun: (body) => {
          if (body.file) {
            window.open(this.$getImage(body.file));
          }
        },
        show_fun: (body) => (body.file ? true : false),
      },
    ];
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    rowColor(body) {
      if (body.item.step == "done") {
        return "green lighten-4";
      } else if (
        body.item.step == "fiscal_to_fiscal_supervisor" ||
        body.item.step == "fiscal_supervisor_to_manager" ||
        body.item.step == "fiscal_manager_to_debtor" ||
        body.item.step == "not_accept_reviewer" ||
        body.item.step == "cancel" ||
        body.item.step == "reviewer_to_debtor"
      ) {
        return "red lighten-4";
      }
    },
  },
};
</script>
