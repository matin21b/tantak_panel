<template>
  <div>
    <v-window v-model="step">
      <v-window-item :value="1">
        <BaseTable
          ref="RefreshPayments"
          url="/payment"
          :BTNactions="btn_actions"
          :headers="headers"
        >
        </BaseTable>
      </v-window-item>

      <v-window-item :value="2">
        <Confirmation
          :payId="pay_id"
          :userInfo="user_info"
          @back="step--"
          @refresh="refresh"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>

import BaseTable from "~/components/DataTable/BaseTable";
import Confirmation from "~/components/Product/Confirmation.vue";
export default {
  components: { BaseTable, Confirmation },
  data: () => ({
    headers: [],
    btn_actions: [],
    user_info: {},
    step: 1,
    pay_id: "",
    title: "لیست پرداخت ها ",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        color: "info",
        text: "پرداخت",
        icon: "check_circle",
        fun: (body) => {
          this.step++;
          this.pay_id = body.id;
          this.user_info = body.user;
          this.user_info["price"] = body.price;
        },
        show_fun: (body) => {
          if (body.status == "wait" && body.kind_set == "cardToCard ") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
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
        text: "نام مشتری",
        value: (body) => {
          if (body.user) {
            return body.user.first_name ? body.user.first_name : "--";
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (body.user) {
            return body.user.last_name ? body.user.last_name : "--";
          }
        },
      },
      {
        text: "شماره همراه",
        value: (body) => {
          if (body.user) {
            let start = body.user.username.slice(0, 3);
            let end = body.user.username.slice(-4);

            let phone_number = end + "****" + start;
            return phone_number;
          }
        },
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: [
          { text: "منتظر پرداخت", value: "wait" },
          { text: "پرداخت شده", value: "payed" },
          { text: " پرداخت نشده", value: "unpayed" },
          { text: "برگشت ", value: "reject" },
          { text: "کنسل شده", value: "cancled" },
        ],
      },
      {
        text: "نوع پرداخت",
        value: "kind_set",
        filterType: "select",

        items: [
          { text: " بانکی", value: "bank" },
          { text: " دستی", value: "manual" },
          { text: "  کارت به کارت ", value: "cardToCard" },
          { text: "نقدی ", value: "naghd" },
          { text: " چک", value: "check" },
          { text: "ارسال لینک پرداخت", value: "send_pay_link" },
          { text: "   کارت خوان", value: "pos" },
          { text: " پرداخت درب منزل", value: "post" },
        ],
      },

      { text: "مقدار پرداختی (ریال)", type: "price", value: "price" },
      {
        text: "توضیحات",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.text) {
            return body.text;
          }
        },
        value: (body) => {
          if (typeof body.text == "string") {
            if (body.text.length < 25) {
              return body.text;
            }
            return body.text.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "birth_date",
        text: "تاریخ پرداخت",
        value: (body) => {
          if (body.paid_date) {
            return this.$toJalali(body.paid_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "پرداخت نشده";
        },
      },
    ];
  },
  methods: {
    refresh() {
      this.$refs.RefreshPayments.getDataFromApi();
    },
  },
};
</script>
