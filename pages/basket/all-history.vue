<template>
  <div>
    <v-col>
      <v-row cols="12" class="center-div mt-5">
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
      url="/basket/my-referral-history"
      :filters="filters"
      :headers="headers"
      :BTNactions="btn_actions"
    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "فعالیت های من", key: "my_logs" },
    ],
    headers: [],
    btn_actions: [],
    user_login_id: "",
    filters: {},
    title: "تاریخچه سبد های خرید",
  }),
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
  beforeMount() {
    this.user_login_id = this.$store.state.auth.user.id;
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
      {
        text: "پیام",
        value: "message",
      },
      {
        text: "شماره فاکتور",
        value: (body) => {
          if (body.basket) {
            return body.basket.factor_number;
          }
        },
      },
      {
        text: "نوع ارجاع",
        value: "text",
      },
      {
        text: "ارجاع دهنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.sender) {
            return `<span class='success--text mx-2'>${body.sender.first_name} ${body.sender.last_name} | ${body.sender.username}</span>`;
          }
        },
      },
      {
        text: "گیرنده",
        disableSort: "true",
        filterable: false,
        value: (body) => {
          if (body.geter) {
            return `<span class='info--text mx-2'>${body.geter.first_name} ${body.geter.last_name} | ${body.geter.username}</span>`;
          } else {
            return "ندارد";
          }
        },
      },
      {
        text: "پیام",
        filterCol: "message",
        type: "tooltip",
        function: (body) => {
          if (body.message) {
            return body.message;
          }
        },
        value: (body) => {
          if (typeof body.message == "string") {
            if (body.message.length < 25) {
              return body.message;
            }
            return body.message.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.btn_actions = [
      {
        text: "مشاهده فایل",
        icon: "attach_file",
        color: "info darken-2",
        fun: (body) => {
          window.open(this.$getImage(body.file));
        },
        show_fun: (body) => {
          if (body.file) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },
};
</script>
