<template>
  <div>
    <BaseTable
      url="/sale-agency-stock/history"
      :headers="headers"
      :filters="filters"
      :root-body="root_body"
      :extraBtn="extra_btn"
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
    sectionId: {
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
      product: { product_id: "" },
      root_body: "",
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
    this.filters = {
      section_id: {
        op: "=",
        value: this.sectionId,
      },
    };
    this.root_body = { sale_agency_id: this.branchId };
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
        text: "نام کاربر",
        filtrabel: false,
        value: (body) => {
          if (body.user.first_name) {
            return body.user.first_name;
          } else {
            return body.user.username;
          }
        },
      },
      {
        text: "نام خانوادگی",
        filtrabel: false,
        value: (body) => {
          if (body.user.last_name) {
            return body.user.last_name;
          } else {
            return "--";
          }
        },
      },

      {
        text: " موجودی قدیم",
        filterable: false,
        value: (body) => {
          let items = [];
          items.push(
            `<span class="primary--text font_13"> موجودی  : ${body.befor_change_stock.toLocaleString()} </span>`
          );

          items.push(
            `<span class="primary--text font_13">موجودی  انبار : ${body.befor_change_saved_stock.toLocaleString()} </span>`
          );

          return items.join("<br>");
        },
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
        text: "موجودی جدید",
        filterable: false,
        value: (body) => {
          let items = [];

          items.push(
            `<span class="teal--text font_13">موجودی :   ${body.after_change_stock.toLocaleString()} </span>`
          );

          items.push(
            `<span class="teal--text font_13">موجودی  انبار   : ${body.after_change_saved_stock.toLocaleString()} </span>`
          );
          return items.join("<br>");
        },
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
  },
  methods: {
    backStep() {
      this.$emit("backStep");
    },
  },
};
</script>
