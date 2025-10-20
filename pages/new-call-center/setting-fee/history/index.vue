<template>
  <div>
    <BaseTable
      url="/fee-log"
      :headers="headers"


    >
    </BaseTable>
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    extra_btn: [],

    title: "تاریخچه کارمزد ها",
  }),
  beforeMount() {
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
        text: "نام مدیر",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.first_name;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.last_name;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },
      {
        text: "شماره همراه",
        value: (body) => {
          if (Boolean(body.user)) {
            let name = body.user.username;
            if (Boolean(name)) {
              return name;
            } else {
              return "--";
            }
          }
        },
      },
      { text: "مبلغ واریزی    (ریال)", value: "amount" ,  type:"price" },
    
    ];
 
  },
};
</script>
