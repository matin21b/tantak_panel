<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="12">
        <v-card max-width="380" class="elevation-0">
          <div>محبوبه مجتبائی</div>
          <div class="my-1">به تن تاک خوش اومدی!</div>
          <div class="d-flex align-center">
            <v-icon size="18" color="green">circle</v-icon>
            <span class="mr-1">آنلاین</span>
            <v-icon size="20">edit</v-icon>
          </div>
          <v-divider color="#fd5800" class="mt-3"></v-divider>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        :class="$vuetify.breakpoint.mdAndUp ? '' : 'd-flex'"
      >
        <!-- کاردهای کناری داشبورد -->
        <SideCard v-for="(card, i) in sides" :key="i" :card="card" />
      </v-col>
      <v-col cols="12" md="6">
        <v-sheet :class="['d-flex align-center gray py-1 px-4 border5', $vuetify.breakpoint.mdAndUp ? 'width-800' : '']">
          <div>همکاران من:</div>
          <div class="mr-3">
            <img src="/image/default-user.jpg" width="30" class="mt-2" />
          </div>
        </v-sheet>
        <!-- جدول کارتابل -->
        <MainTable />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import MainTable from "@/components/dashboard/MainCard";
import SideCard from "@/components/dashboard/SideCard";
export default {
  components: { MainTable, SideCard },
  data: () => ({
    title: "کارتابل",
    roles: [],
    sides: [
      {
        icon: "/image/dashboard/todolist.svg",
        title: "کارهای امروز من",
        // backgroundColor: '#8BE014',
        color: "#80CC16B2",
        // textcolor: '#fff',
        count: "0",
      },
      {
        icon: "/image/dashboard/works2.svg",
        title: "کارهای دارای تاخیر",
        // backgroundColor: '#FFA04DB2',
        color: "#FF7700B2",
        // textcolor: '#fff',
        count: "0",
      },
      {
        icon: "/image/dashboard/works3.svg",
        title: "کارهای قابل پیگیری",
        // backgroundColor: '#7EC5FF',
        color: "#118EF3B2",
        // textcolor: '#fff',
        count: "0",
      },
      {
        icon: "/image/dashboard/Chat.svg",
        title: "پیام های شخصی من",
        backgroundColor: '#EDA6FF',
        color: "#E476FFB2",
        textcolor: '#fff',
        count: "6",
      },
    ],
  }),
  computed: {
    person() {
      let person = this.$store.state.auth.pg_user;
      if (person) {
        return person;
      }
      return { error: true, message: "error" };
    },
  },
  beforeMount() {
    this.changeRout();
    this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    changeRout() {
      let actions = this.$store.state.auth.action;

      let access = [];
      // actions.forEach(ele => {
      //   if(ele == 'panel/admin'){
      //     access.push({
      //       text:'panelAdmin',
      //       value:'/panel/admin'
      //     })
      //   }

      //   if(ele == 'panel/landing_manager'){
      //     access.push({
      //       text:'landing_manager',
      //       value:'/panel/landing_manager'
      //     })
      //   }

      //   if(ele == 'landing_user_setting/is_role'){
      //     access.push({
      //       text:'landing_user_setting',
      //       value:'/landing_user_setting/is_role'
      //     })
      //   }

      //   if(ele == 'hamrahetam_landing_setting/is_role'){
      //     access.push({
      //       text:'hamragtam_landing_setting',
      //       value:'/hamrahetam_landing_setting/is_role'
      //     })
      //   }

      //   if(ele == 'customer_club/panel'){
      //     access.push({
      //       text:'coutomer club',
      //       value:'/customer_club/panel'
      //     })
      //   }

      //   if(ele == 'service_payment/index'){
      //     access.push({
      //       text:'service_payment',
      //       value:'/service_payment/index'
      //     })
      //   }

      // });
      // this.roles = access

      if (actions.indexOf("panel/admin") > -1) {
        this.$router.push("/panel/admin");
        return;
      }
    },
    setCartable(data) {},
  },
};
</script>
