<template>
  <div>
    <BaseTable
      url="/user/list-employee"
      :headers="headers"
      ref="RefreshStaff"
      :extraBtn="extraBtn"
    />
    <StaafDialog
      v-if="dialog_staff.show"
      :DialogStaff="dialog_staff"
      @relod="reload"
    />
  </div>
</template>

<script>
import BaseTable from "~/components/DataTable/BaseTable";
import StaafDialog from "~/components/NewCallCenter/StaafDialog.vue";
export default {
  components: { BaseTable, StaafDialog },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست کارکنان",
    dialog_staff: {
      items: null,
      show: false,
    },
  }),
  beforeMount() {
    this.extraBtn = [
      {
        text: "افزودن زیر مجموعه",
        color: "primary darkeb-2",
        icon: "person_add",
        fun: (body) => {
          this.dialog_staff.show = true;
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
    ];
  },
  methods:{
    reload(){
      this.$refs.RefreshStaff.getDataFromApi()
    }
  }
};
</script>
