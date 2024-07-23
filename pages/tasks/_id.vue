<template>
  <TasksForm :model-id="$route.params.id" />
</template>

<script>
import TasksForm from "@/components/Tsaks/TasksForm.vue";
export default {
  components: { TasksForm },
  data: () => ({
    title: "ویرایش  وظیفه",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
  },
};
</script>
