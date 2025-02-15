<template>
  <div>
    <ComplaintsForCustomer :filter-user="false" />
  </div>
</template>

<script>
import ComplaintsForCustomer from "@/components/NewCallCenter/Complaint/ComplaintsForCustomer.vue";
export default {
  components: {
    ComplaintsForCustomer,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    title: "لیست شکایات",
  }),
  beforeMount() {},
};
</script>
