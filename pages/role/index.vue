<template>
  <v-row>
    <v-col cols="12" md="12">
      <BaseTable
        url="role"
        :headers="headers"
        createUrl="/role/insert"
        :filters='filters'
        :autoLoad="false"
        autoUpdate="/role"
        autoDelete="/role/delete"
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
    title: "نقش ها"
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
        value: "name"
      }
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
     setFilter(value) {
      if (value == 'all') {
        this.filters ={}
      } else {
        this.filters = {
          category_id: {
            op: '=',
            value: value,
          },
        }
      }
      this.items.forEach(element => {
        if(element.value == value){
          element.outline = false
        }else{
          element.outline = true
        }
      });
    },
  }
};
</script>
