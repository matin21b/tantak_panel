<template>
  <div>
    <div>
      <BaseTable url="request-log" :headers="headers" :rowColor="rowColor" />
    </div>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "فهرست درخواست ها"
  }),
  beforeMount() {
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: body => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        }
      },
      {
        text: "نام",
        value: "user_first_name"
      },
      {
        text: "نام خانوادگی",
        value: "user_last_name"
      },
      {
        text: "شماره تماس",
        value: "user_username"
      },
      {
        text: "وضعیت",
        type: "boolean",
        filterable: false,
        value: body => {
          if (body.end_status == 200) {
            return true;
          } else {
            return false;
          }
        }
      },
      { text: "آدرس درخواست", value: "ulr" },
      { text: "شیوه درخواست", value: "method" },
      {
        text: "پبغام",
        filterCol: "message",
        type: "tooltip",
        function: body => {
          if (body.message) {
            return body.message;
          }
        },
        value: body => {
          if (typeof body.message == "string") {
            if (body.message != "") {
              if (body.message.length < 25) {
                return body.message;
              }
              return body.message.slice(0, 25) + "...";
            } else {
              return "-";
            }
          }
        }
      },
      { text: "IP", value: "ip" }
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    rowColor(body) {
      if (body.item.end_status != 200) {
        return "red lighten-5";
      }
    }
  }
};
</script>
