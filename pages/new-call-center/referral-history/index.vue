<template>
  <div>
    <BaseTable url="/product-request/referral-history-all" :headers="headers" />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "تاریخچه درخواست موجودی",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
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
        text: "ارسال کننده",
        value: (body) => {
          if (body.sender.first_name && body.sender.last_name) {
            let first_name = body.sender.first_name;
            let last_name = body.sender.last_name;
            let full_name = first_name +" "+ last_name;
            return full_name;
          } else if (body.sender) {
            return body.sender.username;
          }
        },
      },
      {
        text: "دریافت کننده",
        value: (body) => {
          if (body.geter.first_name && body.geter.last_name) {
            let first_name = body.geter.first_name;
            let last_name = body.geter.last_name;
            let full_name = first_name +" "+ last_name;
            return full_name;
          } else if (body.geter) {
            return body.geter.username;
          }
        },
      },
      {
        text: "نوع ارجاع",
        value: (body) => {
          if (body.text) {
            return body.text;
          }
        },
      },
      {
        text: "شماره درخواست موجودی",
        value: (body) => {
          if (body.order_number) {
            return body.order_number;
          }
        },
      },
      {
        text: "پیام",
        value: (body) => {
          if (body.message) {
            return body.message;
          }
        },
      },
      {
        text: "فایل",
        value: (body) => {
          if (body.file) {
            return body.file;
          }
        },
      },
    ];
  },
  methods: {},
};
</script>

<style></style>
