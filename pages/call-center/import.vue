<template>
  <v-row>
    <v-col cols="12" md="12" v-if="is_admin">
      <v-row>
        <v-col cols="12" md="5">
          <ImportExcel
            text="ورود اکسل سرپرست"
            url="/call-center/import-supervise"
            backurl="/"
          />
        </v-col>
        <v-col cols="12" md="2" class="center-div">
          <v-divider vertical></v-divider>
          <v-divider vertical></v-divider>
          <v-divider vertical></v-divider>
        </v-col>
        <v-col cols="12" md="5">
          <ImportExcel
            text="ورود اکسل اپراتور"
            url="/call-center/import-operator"
            backurl="/"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="12" class="d-flex justify-center" v-if="url && !is_admin">
      <v-card min-width="700" class="elevation-0" >
        <ImportExcel :url="url" backurl="/" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import ImportExcel from "@/components/CallCenter/ImportExcel.vue";
export default {
  components: { ImportExcel },
  data: () => ({
    title: "ورود اکسل",
    url: "",
    is_admin: false,
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.url = "call-center/import-operator";
    } else if (
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      this.url = "call-center/import-supervise";
    } else if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_admin = true;
    }
  },
};
</script>
