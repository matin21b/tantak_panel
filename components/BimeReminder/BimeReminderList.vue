<template>
  <v-row>
    <v-col cols="12" md="12" class="center-div">
      <v-row>
        <v-col cols="12" md="7" class="d-flex justify-end">
          <v-chip
            dark
            class="ma-2"
            color="btn_color"
            v-for="(item, index) in items"
            :key="index"
            @click="setFilters(item.value)"
            :outlined="item.outline"
          >
            {{ item.text }}
          </v-chip>
        </v-col>
        <v-col cols="12" md="5" class="d-flex justify-end">
          <amp-help :text="help_text"></amp-help>
        </v-col>
      </v-row>
    </v-col>
    <v-col
      cols="12"
      md="12"
      v-if="defUser"
      class="d-flex justify-end pl-8 mt-3"
    >
    </v-col>
    <v-col cols="12" md="12">
      <BaseTable
        url="bime-reminder"
        :headers="headers"
        :createUrl="create_url"
        :autoLoad="false"
        :filters="filters"
        :autoUpdate="update_url"
        autoDelete="/bime-reminder/delete"
        :rowColor="rowColor"
      />
    </v-col>
  </v-row>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
let jmoment = require("moment");
export default {
  components: { BaseTable },
  props: {
    modelId: {
      require: false,
      default: false
    },
    defUser: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      title: "یادآوری بیمه",
      create_url: "/bime-reminder/insert",
      update_url: "/bime-reminder",
      filters: {},
      help_text:
        "یاد آوری های که تا تاریخ آنها 15 روز یا کمتر مانده است در تب نزدیک به انقضا نمایش داده می شوند",
      headers: [],
      items: [
        { text: "همه", value: "", outline: true },
        { text: "نزدیک به انقضا", value: "close", outline: false },
        { text: "منقضی شده", value: "expired", outline: false }
      ]
    };
  },
  beforeMount() {
    this.now = jmoment().format("YYYY-MM-DD");
    if (this.modelId) {
      this.filters = {
        user_id: {
          op: "=",
          value: this.modelId
        }
      };
    }
    this.headers = [
      {
        text: "تاریخ ثبت",
        filterCol: "created_at",
        filterType: "date",
        value: body => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        }
      },
      {
        text: "نوع بیمه",
        value: "bime_type"
      },
      {
        text: "تکرار چرخه",
        filterType: "select",
        value: "repeatation_cycle",
        items: this.$store.state.static.repeatation_cycle
      },
      {
        filterable: false,
        disableSort: true,
        filterType: "date",
        filterCol: "date",
        text: "تاریخ",
        value: body => {
          if (body.date) {
            return this.$toJalali(body.date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
          }
          return "";
        }
      },
      {
        text: "توضیحات",
        filterCol: "descriptions",
        type: "tooltip",
        function: body => {
          if (body.descriptions) {
            return body.descriptions;
          }
        },
        value: body => {
          if (typeof body.descriptions == "string") {
            if (body.descriptions.length < 25) {
              return body.descriptions;
            }
            return body.descriptions.slice(0, 25) + "...";
          } else {
            return "-";
          }
        }
      }
    ];
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
    if (this.defUser) {
      this.create_url = "";
    }
  },
  methods: {
    setFilters(data) {
      this.items.forEach(element => {
        if (element.value == data) {
          element.outline = true;
        } else {
          element.outline = false;
        }
      });
      if (data) {
        if (data == "close") {
          if (this.modelId) {
            this.filters = {
              date: {
                op: "between",
                from: this.now,
                to: jmoment(this.now).add(15, "days").format("YYYY-MM-DD")
              },
              user_id: {
                op: "=",
                value: this.modelId
              }
            };
          } else {
            this.filters = {
              date: {
                op: "between",
                from: this.now,
                to: jmoment(this.now).add(15, "days").format("YYYY-MM-DD")
              }
            };
          }
        }
        if (data == "expired") {
          if (this.modelId) {
            this.filters = {
              date: { op: "<", value: this.now },
              user_id: {
                op: "=",
                value: this.modelId
              }
            };
          } else {
            this.filters = {
              date: { op: "<", value: this.now }
            };
          }
        }
      } else {
        if (this.modelId) {
          this.filters = {
            user_id: {
              op: "=",
              value: this.modelId
            }
          };
        } else {
          this.filters = {};
        }
      }
    },
    rowColor(body) {
      if (body.item.date < this.now) {
        return 'grey lighten-2'
      }
      if (body.item.date < jmoment(this.now).add(15, 'days').format('YYYY-MM-DD')) {
        return 'orange lighten-4'
      }
    },
  }
};
</script>
