<template>
  <div>
    <MetabaseLogs
      v-if="this.$checkRole(this.$store.state.auth.role.admin_id)"
    />
  </div>
</template>

<script>
import MetabaseLogs from "@/components/Cartabl/MetabaseLogs.vue";
export default {
  components: {
    MetabaseLogs,
  },
  data: () => ({
    title: "کارتابل",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
  },
  mounted() {
    this.redirect();
  },
  methods: {
    redirect() {
      if (this.$checkAccess("access_cartable/coordinator_manager")) {
        this.$router.push("/panel/coordinator-manager");
      }
      if (this.$checkAccess("access_cartable/coordinator")) {
        this.$router.push("/panel/coordinator");
      }
      if (this.$checkAccess("access_cartable/coordinator_supervisor")) {
        this.$router.push("/panel/coordinator-supervisor");
      }
      // ----------------------------------------------------------------------

      if (this.$checkAccess("access_cartable/cartable_fiscal_manager")) {
        this.$router.push("/panel/financial-manager");
      }
      if (this.$checkAccess("access_cartable/cartable_fiscal_supervisor")) {
        this.$router.push("/panel/financial-supervisor");
      }
      if (this.$checkAccess("access_cartable/cartable_fiscal")) {
        this.$router.push("/panel/financial");
      }
      // ----------------------------------------------------------------------

      if (this.$checkAccess("access_cartable/cartable_sefir")) {
        this.$router.push("/panel/sefir");
      }

      // ----------------------------------------------------------------------

      if (
        this.$checkAccess("access_cartable/cartable_supervisor_center_stock")
      ) {
        this.$router.push("/panel/center-stock/supervisor");
      }
      if (this.$checkAccess("access_cartable/cartable_employee_center_stock")) {
        this.$router.push("/panel/center-stock/employee");
      }

      // ----------------------------------------------------------------------
      if (this.$checkAccess("access_cartable/cartable_manager_sale")) {
        this.$router.push("/panel/Sales-units/manager");
      }
      if (this.$checkAccess("access_cartable/cartable_supervisor_sale")) {
        this.$router.push("/panel/Sales-units/supervisor");
      }
      if (this.$checkAccess("access_cartable/cartable_employee_sale")) {
        this.$router.push("/panel/Sales-units/employee");
      }
      // ----------------------------------------------------------------------
      if (this.$checkAccess("access_cartable/cartable_manager_sale_agency")) {
        this.$router.push("/panel/sale-agency/manager");
      }
      if (
        this.$checkAccess("access_cartable/cartable_stockclerk_sale_agency")
      ) {
        this.$router.push("/panel/sale-agency/stockclerk");
      }
      if (this.$checkAccess("access_cartable/cartable_courier")) {
        this.$router.push("/panel/sale-agency/courier");
      }
      if (this.$checkAccess("access_cartable/cartable_employee_sale_agency")) {
        this.$router.push("/panel/sale-agency/employee");
      }
      // ----------------------------------------------------------------------
      if (this.$checkAccess("access_cartable/cartable_operator_call_center")) {
        this.$router.push("/panel/call-center/operator");
      }
      if (
        this.$checkAccess("access_cartable/cartable_supervisor_call_center")
      ) {
        this.$router.push("/panel/call-center/supervisor");
      }
      // ----------------------------------------------------------------------
      if (this.$checkAccess("access_cartable/cartable_send_coordinator")) {
        this.$router.push("/panel/send-coordinator/coordinator");
      }
      if (
        this.$checkAccess("access_cartable/cartable_manager_send_coordinator")
      ) {
        this.$router.push("/panel/send-coordinator/manager");
      }
      if (
        this.$checkAccess(
          "access_cartable/cartable_supervisor_send_coordinator"
        )
      ) {
        this.$router.push("/panel/send-coordinator/supervisor");
      }
    },
  },
};
</script>
<style scoped>
.card-style {
  opacity: 0;
  background-color: rgb(232, 232, 255);
}
.card-style:nth-child(1) {
  opacity: 1;
  transition: all 8s ease !important;
}
.card-style:nth-child(2) {
  opacity: 1;
  transition: all 1.5s ease !important;
}
.card-style:nth-child(3) {
  background-color: rgb(178, 178, 248);
  opacity: 1;
  transition: all 2s eases !important;
}
.card-style:nth-child(4) {
  background-color: rgb(178, 178, 248);
  opacity: 1;
  transition: all 2.5s ease !important;
}
.card-style:nth-child(5) {
  background-color: rgb(178, 178, 248);
  opacity: 1;
  transition: all 3s ease !important;
}
</style>
