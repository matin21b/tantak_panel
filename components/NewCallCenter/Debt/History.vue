<template>
  <div>
    <BaseTable
      url="debt/referral-history/debts/logs"
      :headers="headers"
      :extraBtn="extra_btn"
      :rootBody="root_body"
      :BTNactions="btn_actions"
      :rowColor="rowColor"
    />
  </div>
</template>
<script>
export default {
  props: {
    branchId: {
      require: false,
      default: false,
    },
    modelId: {
      type: String,
      default: "",
    },
    productVarInfo: {
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
    this.root_body = { section_id: this.modelId, section_name: "Debt" };
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
        text: "نام ارسال کننده",
        value: "send_user_first_name",
      },
      {
        text: "نام خانوادگی ارسال کننده",
        value: "send_user_last_name",
      },
      {
        text: "شماره همراه",
        value: "send_user_username",
      },
      {
        text: "پیام",
        filterable: false,
        type: "tooltip",
        function: (body) => {
          if (body.text_log) {
            return body.text_log;
          }
        },
        value: (body) => {
          if (typeof body.text_log == "string") {
            if (body.text_log.length < 25) {
              return body.text_log;
            }
            return body.text_log.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        text: "نام  گیرنده",
        value: "get_user_first_name",
      },
      {
        text: "نام خانوادگی گیرنده",
        value: "get_user_last_name",
      },
      {
        text: "شماره همراه گیرنده",
        value: "get_user_username",
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
    this.btn_actions =[
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
    ]
  },
  methods: {
    backStep() {
      this.$emit("backStep");
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
