<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="/delivery-time"
        :headers="headers"
        createUrl="/setting/delivery-time/insert"
        :filters="filters"
        :autoLoad="false"
        autoUpdate="/setting/delivery-time"
        :BTNactions="btn_actions"
        autoDelete="/delivery-time/delete"
      />
    </v-col>
  </v-row>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    headers: [],
    items: [],
    filters: {},
    btn_actions: [],
    title: "لیست بازه های زمانی",
  }),
  beforeMount() {
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
      { text: "بازه زمانی", value:(body)=> {
        if (body.range_time) {
          let  substrings = body.range_time.split(',');
          let numbers = substrings.map(substring => Number(substring));
return " از " + numbers[0] + " تا " + numbers[1]

        }
      } },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.branch_status,
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    setFilter(value) {
      if (value == "all") {
        this.filters = {};
      } else {
        this.filters = {
          category_id: {
            op: "=",
            value: value,
          },
        };
      }
      this.items.forEach((element) => {
        if (element.value == value) {
          element.outline = false;
        } else {
          element.outline = true;
        }
      });
    },
  },
};
</script>
