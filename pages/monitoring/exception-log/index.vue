<template>
  <div>
    <div>
      <BaseTable url="exception-log" :headers="headers" :rowColor="rowColor" />
    </div>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    title: "فهرست خطاها"
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
        value:'status',
      },
       {
        text: "فایل",
        filterCol: "file",
        type: "tooltip",
        function: body => {
          if (body.file) {
            return body.file;
          }
        },
        value: body => {
          if (typeof body.file == "string") {
            if (body.file != "") {
              if (body.file.length < 25) {
                return body.file;
              }
              return body.file.slice(0, 25) + "...";
            } else {
              return "-";
            }
          }
        }
      },
      { text: "خط", value: "line" },
      { text:'کد', value:'code'},
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
