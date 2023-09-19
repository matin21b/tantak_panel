<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" md="12">
        <v-card class="center-div" >
          <v-card-title> کارتابل پنل ادمین </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    title: "کارتابل",
    roles: []
  }),
  computed: {
    person() {
      let person = this.$store.state.auth.pg_user;
      if (person) {
        return person;
      }
      return { error: true, message: "error" };
    }
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
    setCartable(data) {}
  }
};
</script>
