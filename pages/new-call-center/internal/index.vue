<template>
  <div>
    <BaseTable
      url="/internal"
      createUrl="/new-call-center/internal/insert"
      autoUpdate="/new-call-center/internal"
      autoDelete="internal/delete"
      :headers="headers"
      :BTNactions="btn_actions"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست اطلاعات داخلی",
    dialog_staff: {
      items: null,
      show: false,
    },
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        text: "کپی کردن مسیر سرور",
        icon: "content_copy",
        color: "teal darken-2",
        fun: (body) => {
          if (body.server_url) {
            navigator.clipboard.writeText(body.server_url);
            this.$toast.success("مسیر سرور کپی شد");
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
      { text: "نام سرور", value: "server_name" },
      {
        text: "بازه پورت",
        value: (body) => {
          return `شروع از  ${this.$price(body.start_port)} تا ${this.$price(
            body.end_port
          )}`;
        },
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.status,
      },
    ];
  },
  methods: {
    reload() {
      this.$refs.RefreshStaff.getDataFromApi();
    },
  },
};
</script>
