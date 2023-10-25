<template>
  <div>
    <v-dialog v-model="dialogShowItem.show" max-width="700">
      <v-card v-if="dialogShowItem.item" class="pa-4">
        <v-card-title class="d-flex justify-space-around flex-wrap">
          <span dir="ltr">
            تاریخ ارسال : {{ $toJalali(dialogShowItem.item.created_at) }}
          </span>
          <span class="font_24">
            {{ dialogShowItem.item.first_name }}
            {{ dialogShowItem.item.last_name }}
          </span>
          <span> شماره تماس : {{ dialogShowItem.item.phone_number }} </span>
        </v-card-title>
        <v-card-text>
          <v-divider class="mb-2"></v-divider>
          <v-row>
            <v-col cols="12" md="12" class="mt-3 mx-3">
              {{ dialogShowItem.item.subject }} :
            </v-col>
            <v-col cols="12" md="12" class="mx-3">{{
              dialogShowItem.item.text
            }}</v-col>
          </v-row>
        </v-card-text>
        <v-card-actions
          class="center-div"
          v-if="dialogShowItem.item.status == 'pending'"
        >
          <v-btn class="success" @click="reviewContact(dialogShowItem.item)">
            بررسی
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12" md="12" class="center-div">
        <v-chip
          dark
          class="ma-2"
          color="primary"
          v-for="(item, index) in items_chip"
          :key="index"
          @click="setFilters(item.value)"
          :outlined="item.outline"
        >
          {{ item.text }}
        </v-chip>
      </v-col>
      <v-col cols="12" md="12">
        <BaseTable
          url="/contact-us-form"
          :headers="headers"
          :filters="filters"
          :BTNactions="btn_actions"
          ref="tableContactUs"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    createUrl: "/forms/contact-us-form/insert",
    deleteUrl: "/contact-us-form/delete",
    updateUrl: "/forms/contact-us-form",
    headers: [],
    items: [],
    filters: {},
    btn_actions: [],
    items_chip: [
      {
        text: "بررسی شده",
        value: "reviewed",
        outline: false
      },
      {
        text: "در حال انتظار",
        value: "pending",
        outline: true
      }
    ],
    dialogShowItem: { show: false, item: null },
    title: "تماس با ما"
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.filters = {
      status: {
        op: "=",
        value: "reviewed"
      }
    };
    this.btn_actions = [
      {
        color: "primary",
        icon: "visibility",
        text: "",
        fun: body => {
          if (body.id) {
            this.dialogShowItem.show = true;
            this.dialogShowItem.item = body;
          }
        }
      },
      {
        color: "success",
        icon: "check",
        text: "",
        fun: body => {
          if (body.id) {
            body.status = "reviewed";
            this.$reqApi("/contact-us-form/update", body)
              .then(res => {
                this.$refs.tableContactUs.getDataFromApi();
                return res;
              })
              .catch(err => {
                return err;
              });
          }
        },
        show_fun:body=>{
          if(body.status == 'pending'){
            return true
          }
        }
      }
    ];
  },
  mounted() {
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
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      {
        text: "شماره تماس",
        value: "phone_number"
      },
      {
        text: "موضوع",
        value: "subject"
      },
      {
        text: "وضعیت",
        filterType: "select",
        value: "status",
        items: this.$store.state.static.status_contact_form
      }
    ];
  },
  methods: {
    reviewContact(data) {
      data.status = "reviewed";
      this.$reqApi("/contact-us-form/update", data)
        .then(res => {
          this.dialogShowItem.show = false;
          this.$refs.tableContactUs.getDataFromApi();
        })
        .catch(err => {
          return err;
        }); 
    },
    setFilters(data) {
      this.items_chip.forEach(element => {
        if (element.value == data) {
          element.outline = false;
        } else {
          element.outline = true;
        }
      });
      if (data) {
        this.filters = {
          status: {
            op: "=",
            value: data
          }
        };
      } else {
        this.filters = {};
      }
    }
  }
};
</script>

<style></style>
