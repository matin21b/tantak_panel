<template>
  <div>
    <!-- <v-dialog v-model="dialogShowItem.show" max-width="700">
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
            <v-col cols="12" md="12" class="mt-3 mx-3 " > {{dialogShowItem.item.subject}} : </v-col>
            <v-col cols="12" md="12" class="mx-3" >{{dialogShowItem.item.text}}</v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <BaseTable
      url="/complaint-form"
      :headers="headers"
      :BTNactions="btn_actions"
      :autoUpdate="updateUrl"
      :createUrl="createUrl"
    />
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  data: () => ({
    createUrl: "/forms/complaint/insert",
    deleteUrl: "/complaint-form/delete",
    updateUrl: "/forms/complaint",
    headers: [],
    items: [],
    btn_actions: [],
    // dialogShowItem: { show: false, item: null },
    title: "شکایات"
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
  }
};
</script>

<style></style>
