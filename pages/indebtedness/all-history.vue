<template>
  <div>
    <v-col cols="12">
      <v-row  class="center-div mt-5">
        <v-chip
          dark
          label
          class="ma-2 px-3"
          color="teal"
          v-for="item in items"
          :key="item.key"
          @click="tab = item.key"
          :outlined="tab != item.key"
        >
          {{ item.text }}
        </v-chip>
      </v-row>
    </v-col>
    <BaseTable
      url="debt/referral-history-all/debts/logs"
      :headers="headers"
      :rootBody="root_body"
      :rowColor="rowColor"
      :filters="filters"
      :BTNactions="btn_actions"
    />
  </div>
</template>
<script>
export default {
  props: {
    productVarInfo: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      panel: 1,
      user_login_id: "",
      continue_form: false,
      loading: false,
      filters: {},
      response: [],
      headers: [],
      btn_actions: [],
      extra_btn: [],
      product: { product_id: "" },
      root_body: {},
      tab: "all",
      items: [
        { text: "همه", key: "all" },
        { text: "فعالیت های من", key: "my_logs" },
      ],

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
    this.user_login_id = this.$store.state.auth.user.id;
    this.root_body = { section_name: "Debt" };
  },
  watch: {
    tab() {
      switch (this.tab) {
        case "all":
          this.filters = {};
          break;
        case "my_logs":
          this.filters = {
            send_user_id: {
              op: "=",
              value: this.user_login_id,
            },
          };
          break;
      }
    },
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
        show_fun: (body) => {
          if (Boolean(body.file)) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
  methods: {
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
